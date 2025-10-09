/**
 * 직원 데이터 관리 Hook
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Staff } from "@/types/electron";
import {
  UseQueryOptions,
  DEFAULT_RETRY_OPTIONS,
  DEFAULT_CACHE_OPTIONS,
} from "./types";
import {
  retryAsync,
  isIpcAvailable,
  cache,
  devLog,
  logError,
} from "./utils";

// ========== Hook 반환 타입 ==========

export interface UseStaffResult {
  // 조회
  staff: Staff[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // 생성
  createStaff: (data: Omit<Staff, "id">) => Promise<Staff>;
  creating: boolean;
  createError: Error | null;

  // 수정
  updateStaff: (id: number, data: Partial<Staff>) => Promise<Staff>;
  updating: boolean;
  updateError: Error | null;

  // 삭제
  deleteStaff: (id: number) => Promise<void>;
  deleting: boolean;
  deleteError: Error | null;

  // 검색/필터링
  searchStaff: (query: string) => Staff[];
  filterByPosition: (position: string) => Staff[];
  getAvailableStaff: (date: string, startTime: string, endTime: string) => Promise<Staff[]>;

  // 스케줄
  getStaffSchedule: (staffId: number, startDate: string, endDate: string) => Promise<any[]>;

  // 실적
  getStaffPerformance: (startDate: string, endDate: string) => Promise<any[]>;

  // 포지션 목록
  positions: string[];
}

// ========== Hook 구현 ==========

export function useStaff(
  options: UseQueryOptions<Staff[]> = {}
): UseStaffResult {
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

  const [staff, setStaff] = useState<Staff[]>(initialData);
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
  const cacheKey = "staff:all";

  // ========== 데이터 조회 ==========

  const fetchStaff = useCallback(async () => {
    if (!enabled || !isIpcAvailable()) {
      devLog("fetchStaff skipped");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 캐시 확인
      if (cacheOptions.enabled) {
        const cached = cache.get<Staff[]>(cacheKey, cacheOptions.ttl);
        if (cached) {
          devLog("Using cached staff", cached.length);
          setStaff(cached);
          setLoading(false);
          onSuccess?.(cached);
          return;
        }
      }

      // IPC 호출
      const data = await retryAsync(
        () => window.api.db.getStaff(),
        retry
      );

      if (!isMountedRef.current) return;

      setStaff(data);

      // 캐시 저장
      if (cacheOptions.enabled) {
        cache.set(cacheKey, data);
      }

      onSuccess?.(data);
      devLog("Staff fetched", data.length);
    } catch (err) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      logError("fetchStaff", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, retry, cacheOptions, onSuccess, onError]);

  // ========== 생성 ==========

  const createStaff = useCallback(
    async (data: Omit<Staff, "id">): Promise<Staff> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setCreating(true);
      setCreateError(null);

      try {
        const newStaff = await retryAsync(
          () => window.api.db.addStaff(data),
          retry
        );

        if (!isMountedRef.current) return newStaff;

        // 옵티미스틱 업데이트
        setStaff((prev) => [...prev, newStaff]);
        cache.clear(cacheKey);

        devLog("Staff created", newStaff);
        return newStaff;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setCreateError(error);
        logError("createStaff", error);
        throw error;
      } finally {
        if (isMountedRef.current) {
          setCreating(false);
        }
      }
    },
    [retry]
  );

  // ========== 수정 ==========

  const updateStaff = useCallback(
    async (id: number, data: Partial<Staff>): Promise<Staff> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setUpdating(true);
      setUpdateError(null);

      try {
        const updatedStaff = await retryAsync(
          () => window.api.db.updateStaff(id, data),
          retry
        );

        if (!isMountedRef.current) return updatedStaff;

        // 옵티미스틱 업데이트
        setStaff((prev) =>
          prev.map((s) => (s.id === id ? updatedStaff : s))
        );
        cache.clear(cacheKey);

        devLog("Staff updated", updatedStaff);
        return updatedStaff;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setUpdateError(error);
        logError("updateStaff", error);
        throw error;
      } finally {
        if (isMountedRef.current) {
          setUpdating(false);
        }
      }
    },
    [retry]
  );

  // ========== 삭제 ==========

  const deleteStaff = useCallback(
    async (id: number): Promise<void> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setDeleting(true);
      setDeleteError(null);

      try {
        await retryAsync(
          () => window.api.db.deleteStaff(id),
          retry
        );

        if (!isMountedRef.current) return;

        // 옵티미스틱 업데이트
        setStaff((prev) => prev.filter((s) => s.id !== id));
        cache.clear(cacheKey);

        devLog("Staff deleted", id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setDeleteError(error);
        logError("deleteStaff", error);
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

  const searchStaff = useCallback(
    (query: string): Staff[] => {
      if (!query.trim()) return staff;

      const lowerQuery = query.toLowerCase();
      return staff.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerQuery) ||
          s.position?.toLowerCase().includes(lowerQuery) ||
          s.phone?.toLowerCase().includes(lowerQuery)
      );
    },
    [staff]
  );

  const filterByPosition = useCallback(
    (position: string): Staff[] => {
      if (!position) return staff;
      return staff.filter((s) => s.position === position);
    },
    [staff]
  );

  const getAvailableStaff = useCallback(
    async (date: string, startTime: string, endTime: string): Promise<Staff[]> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      try {
        return await retryAsync(
          () => window.api.db.getAvailableStaff(date, startTime, endTime),
          retry
        );
      } catch (err) {
        logError("getAvailableStaff", err as Error);
        throw err;
      }
    },
    [retry]
  );

  // ========== 스케줄 및 실적 ==========

  const getStaffSchedule = useCallback(
    async (staffId: number, startDate: string, endDate: string): Promise<any[]> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      try {
        return await retryAsync(
          () => window.api.db.getStaffSchedule(staffId, startDate, endDate),
          retry
        );
      } catch (err) {
        logError("getStaffSchedule", err as Error);
        throw err;
      }
    },
    [retry]
  );

  const getStaffPerformance = useCallback(
    async (startDate: string, endDate: string): Promise<any[]> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      try {
        return await retryAsync(
          () => window.api.db.getStaffPerformance(startDate, endDate),
          retry
        );
      } catch (err) {
        logError("getStaffPerformance", err as Error);
        throw err;
      }
    },
    [retry]
  );

  // ========== 포지션 목록 ==========

  const positions = useCallback(() => {
    const uniquePositions = new Set(
      staff.map((s) => s.position).filter(Boolean)
    );
    return Array.from(uniquePositions);
  }, [staff])();

  // ========== 초기 로드 ==========

  useEffect(() => {
    if (refetchOnMount) {
      fetchStaff();
    }
  }, [refetchOnMount, fetchStaff]);

  // ========== 클린업 ==========

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ========== 반환 ==========

  return {
    // 조회
    staff,
    loading,
    error,
    refetch: fetchStaff,

    // 생성
    createStaff,
    creating,
    createError,

    // 수정
    updateStaff,
    updating,
    updateError,

    // 삭제
    deleteStaff,
    deleting,
    deleteError,

    // 검색/필터링
    searchStaff,
    filterByPosition,
    getAvailableStaff,

    // 스케줄 및 실적
    getStaffSchedule,
    getStaffPerformance,

    // 포지션 목록
    positions,
  };
}
