/**
 * 예약 데이터 관리 Hook
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Reservation, ReservationWithDetails } from "@/types/electron";
import {
  UseQueryOptions,
  DEFAULT_RETRY_OPTIONS,
  DEFAULT_CACHE_OPTIONS,
} from "./types";
import {
  retryAsync,
  isIpcAvailable,
  cache,
  createCacheKey,
  devLog,
  logError,
} from "./utils";

// ========== Hook 반환 타입 ==========

export interface UseReservationsResult {
  // 조회
  reservations: ReservationWithDetails[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // 생성
  createReservation: (data: Omit<Reservation, "id">) => Promise<Reservation>;
  creating: boolean;
  createError: Error | null;

  // 수정
  updateReservation: (id: number, data: Partial<Reservation>) => Promise<Reservation>;
  updating: boolean;
  updateError: Error | null;

  // 삭제
  deleteReservation: (id: number) => Promise<void>;
  deleting: boolean;
  deleteError: Error | null;

  // 검색/필터링
  filterByDate: (date: string) => ReservationWithDetails[];
  filterByDateRange: (startDate: string, endDate: string) => ReservationWithDetails[];
  filterByStatus: (status: string) => ReservationWithDetails[];
  filterByCustomer: (customerId: number) => ReservationWithDetails[];
  filterByStaff: (staffId: number) => ReservationWithDetails[];

  // 날짜별 조회
  getReservationsByDate: (date: string) => Promise<ReservationWithDetails[]>;

  // 충돌 감지
  checkConflict: (
    staffId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeReservationId?: number
  ) => boolean;

  // 통계
  getTodayReservations: () => ReservationWithDetails[];
  getUpcomingReservations: (days?: number) => ReservationWithDetails[];
  getPendingReservations: () => ReservationWithDetails[];
}

// ========== Hook 구현 ==========

export function useReservations(
  options: UseQueryOptions<ReservationWithDetails[]> = {}
): UseReservationsResult {
  const {
    initialData = [],
    enabled = true,
    refetchOnMount = true,
    retry = DEFAULT_RETRY_OPTIONS,
    cache: cacheOptions = DEFAULT_CACHE_OPTIONS,
    onSuccess,
    onError,
  } = options;

  // ========== 상태 관리 ==========

  const [reservations, setReservations] = useState<ReservationWithDetails[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  // ========== Refs ==========

  const isMountedRef = useRef(true);
  const cacheKey = "reservations:all";

  // ========== 데이터 조회 ==========

  const fetchReservations = useCallback(async () => {
    if (!enabled || !isIpcAvailable()) {
      devLog("fetchReservations skipped");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 캐시 확인
      if (cacheOptions.enabled) {
        const cached = cache.get<ReservationWithDetails[]>(cacheKey, cacheOptions.ttl);
        if (cached) {
          devLog("Using cached reservations", cached.length);
          setReservations(cached);
          setLoading(false);
          onSuccess?.(cached);
          return;
        }
      }

      // IPC 호출 - 상세 정보 포함
      const data = await retryAsync(
        () => window.api.db.getReservationsWithDetails(),
        retry
      );

      if (!isMountedRef.current) return;

      setReservations(data);

      // 캐시 저장
      if (cacheOptions.enabled) {
        cache.set(cacheKey, data);
      }

      onSuccess?.(data);
      devLog("Reservations fetched", data.length);
    } catch (err) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      logError("fetchReservations", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, retry, cacheOptions, onSuccess, onError]);

  // ========== 생성 ==========

  const createReservation = useCallback(
    async (data: Omit<Reservation, "id">): Promise<Reservation> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setCreating(true);
      setCreateError(null);

      try {
        const newReservation = await retryAsync(
          () => window.api.db.addReservation(data),
          retry
        );

        if (!isMountedRef.current) return newReservation;

        // 캐시 무효화 (상세 정보 다시 로드 필요)
        cache.clear(cacheKey);

        // 데이터 다시 가져오기
        await fetchReservations();

        devLog("Reservation created", newReservation);
        return newReservation;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setCreateError(error);
        logError("createReservation", error);
        throw error;
      } finally {
        if (isMountedRef.current) {
          setCreating(false);
        }
      }
    },
    [retry, fetchReservations]
  );

  // ========== 수정 ==========

  const updateReservation = useCallback(
    async (id: number, data: Partial<Reservation>): Promise<Reservation> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setUpdating(true);
      setUpdateError(null);

      try {
        const updatedReservation = await retryAsync(
          () => window.api.db.updateReservation(id, data),
          retry
        );

        if (!isMountedRef.current) return updatedReservation;

        // 캐시 무효화
        cache.clear(cacheKey);

        // 데이터 다시 가져오기
        await fetchReservations();

        devLog("Reservation updated", updatedReservation);
        return updatedReservation;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setUpdateError(error);
        logError("updateReservation", error);
        throw error;
      } finally {
        if (isMountedRef.current) {
          setUpdating(false);
        }
      }
    },
    [retry, fetchReservations]
  );

  // ========== 삭제 ==========

  const deleteReservation = useCallback(
    async (id: number): Promise<void> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setDeleting(true);
      setDeleteError(null);

      try {
        await retryAsync(
          () => window.api.db.deleteReservation(id),
          retry
        );

        if (!isMountedRef.current) return;

        // 옵티미스틱 업데이트
        setReservations((prev) => prev.filter((r) => r.id !== id));
        cache.clear(cacheKey);

        devLog("Reservation deleted", id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setDeleteError(error);
        logError("deleteReservation", error);
        throw error;
      } finally {
        if (isMountedRef.current) {
          setDeleting(false);
        }
      }
    },
    [retry]
  );

  // ========== 검색/필터링 ==========

  const filterByDate = useCallback(
    (date: string): ReservationWithDetails[] => {
      return reservations.filter((r) => r.reservation_date === date);
    },
    [reservations]
  );

  const filterByDateRange = useCallback(
    (startDate: string, endDate: string): ReservationWithDetails[] => {
      return reservations.filter(
        (r) => r.reservation_date >= startDate && r.reservation_date <= endDate
      );
    },
    [reservations]
  );

  const filterByStatus = useCallback(
    (status: string): ReservationWithDetails[] => {
      return reservations.filter((r) => r.status === status);
    },
    [reservations]
  );

  const filterByCustomer = useCallback(
    (customerId: number): ReservationWithDetails[] => {
      return reservations.filter((r) => r.customer_id === customerId);
    },
    [reservations]
  );

  const filterByStaff = useCallback(
    (staffId: number): ReservationWithDetails[] => {
      return reservations.filter((r) => r.staff_id === staffId);
    },
    [reservations]
  );

  // ========== 날짜별 조회 ==========

  const getReservationsByDate = useCallback(
    async (date: string): Promise<ReservationWithDetails[]> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      try {
        return await retryAsync(
          () => window.api.db.getReservationsByDate(date),
          retry
        );
      } catch (err) {
        logError("getReservationsByDate", err as Error);
        throw err;
      }
    },
    [retry]
  );

  // ========== 충돌 감지 ==========

  const checkConflict = useCallback(
    (
      staffId: number,
      date: string,
      startTime: string,
      endTime: string,
      excludeReservationId?: number
    ): boolean => {
      const staffReservations = reservations.filter(
        (r) =>
          r.staff_id === staffId &&
          r.reservation_date === date &&
          r.status !== "cancelled" &&
          r.id !== excludeReservationId
      );

      return staffReservations.some((r) => {
        // 시간 중복 확인
        return (
          (startTime >= r.start_time && startTime < r.end_time) ||
          (endTime > r.start_time && endTime <= r.end_time) ||
          (startTime <= r.start_time && endTime >= r.end_time)
        );
      });
    },
    [reservations]
  );

  // ========== 통계 ==========

  const getTodayReservations = useCallback((): ReservationWithDetails[] => {
    const today = new Date().toISOString().split("T")[0];
    return filterByDate(today);
  }, [filterByDate]);

  const getUpcomingReservations = useCallback(
    (days: number = 7): ReservationWithDetails[] => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const start = today.toISOString().split("T")[0];
      const end = futureDate.toISOString().split("T")[0];

      return filterByDateRange(start, end)
        .filter((r) => r.status !== "cancelled" && r.status !== "completed")
        .sort((a, b) => {
          if (a.reservation_date !== b.reservation_date) {
            return a.reservation_date.localeCompare(b.reservation_date);
          }
          return a.start_time.localeCompare(b.start_time);
        });
    },
    [filterByDateRange]
  );

  const getPendingReservations = useCallback((): ReservationWithDetails[] => {
    return filterByStatus("pending");
  }, [filterByStatus]);

  // ========== 초기 로드 ==========

  useEffect(() => {
    if (refetchOnMount) {
      fetchReservations();
    }
  }, [refetchOnMount, fetchReservations]);

  // ========== 클린업 ==========

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ========== 반환 ==========

  return {
    // 조회
    reservations,
    loading,
    error,
    refetch: fetchReservations,

    // 생성
    createReservation,
    creating,
    createError,

    // 수정
    updateReservation,
    updating,
    updateError,

    // 삭제
    deleteReservation,
    deleting,
    deleteError,

    // 검색/필터링
    filterByDate,
    filterByDateRange,
    filterByStatus,
    filterByCustomer,
    filterByStaff,

    // 날짜별 조회
    getReservationsByDate,

    // 충돌 감지
    checkConflict,

    // 통계
    getTodayReservations,
    getUpcomingReservations,
    getPendingReservations,
  };
}
