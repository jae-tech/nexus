/**
 * 예약 관리 커스텀 훅
 *
 * Electron DB API를 사용하여 예약 데이터를 관리합니다.
 */

import { useState, useEffect, useCallback } from "react";
import type { ReservationWithDetails, Reservation, AvailableTimeSlot, ConflictCheck } from "@/lib/api-types";

/**
 * 예약 목록 조회 훅
 */
export function useReservations(startDate?: string, endDate?: string, status?: string) {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: ReservationWithDetails[];

      if (startDate && endDate) {
        // 날짜 범위로 조회
        const rawData = await window.api.db.getReservationsByDateRange(startDate, endDate, status);
        // 조인 쿼리로 변환
        data = await window.api.db.getReservationsWithDetails();
        data = data.filter((r) => {
          const date = r.reservation_date;
          return date >= startDate && date <= endDate && (!status || r.status === status);
        });
      } else {
        // 전체 조회
        data = await window.api.db.getReservationsWithDetails();
      }

      setReservations(data);
    } catch (err) {
      console.error("[useReservations] Error fetching reservations:", err);
      setError(err instanceof Error ? err.message : "예약 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, status]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
  };
}

/**
 * 특정 날짜의 예약 조회 훅
 */
export function useReservationsByDate(date: string) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await window.api.db.getReservationsByDate(date);
      setReservations(data);
    } catch (err) {
      console.error("[useReservationsByDate] Error fetching reservations:", err);
      setError(err instanceof Error ? err.message : "예약 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
  };
}

/**
 * 예약 생성 훅
 */
export function useCreateReservation() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = useCallback(async (reservation: Omit<Reservation, "id">) => {
    try {
      setCreating(true);
      setError(null);

      // 1. 예약 검증
      const validation = await window.api.reservation.validate(reservation);
      if (!validation.valid) {
        throw new Error(validation.errors.join("\n"));
      }

      // 2. 종료 시간 계산
      const service = await window.api.db.getServiceById(reservation.service_id);
      if (!service) {
        throw new Error("서비스를 찾을 수 없습니다.");
      }

      const endTime = reservation.end_time || await window.api.reservation.calculateEndTime(reservation.start_time, service.duration || 60);

      // 3. 예약 생성
      const id = await window.api.db.addReservation({
        ...reservation,
        end_time: endTime,
      });

      return { success: true, id };
    } catch (err) {
      console.error("[useCreateReservation] Error creating reservation:", err);
      const errorMessage = err instanceof Error ? err.message : "예약 생성 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCreating(false);
    }
  }, []);

  return {
    createReservation,
    creating,
    error,
  };
}

/**
 * 예약 수정 훅
 */
export function useUpdateReservation() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReservation = useCallback(async (id: number, updates: Partial<Reservation>) => {
    try {
      setUpdating(true);
      setError(null);

      // 1. 수정 검증
      const validation = await window.api.reservation.validateUpdate(id, updates);
      if (!validation.valid) {
        throw new Error(validation.errors.join("\n"));
      }

      // 2. 종료 시간 재계산 (서비스가 변경된 경우)
      if (updates.service_id || updates.start_time) {
        const reservation = await window.api.db.getReservationById(id);
        if (!reservation) {
          throw new Error("예약을 찾을 수 없습니다.");
        }

        const serviceId = updates.service_id || reservation.service_id;
        const service = await window.api.db.getServiceById(serviceId);
        if (!service) {
          throw new Error("서비스를 찾을 수 없습니다.");
        }

        const startTime = updates.start_time || reservation.start_time;
        const endTime = await window.api.reservation.calculateEndTime(startTime, service.duration || 60);
        updates.end_time = endTime;
      }

      // 3. 예약 수정
      await window.api.db.updateReservation(id, updates);

      return { success: true };
    } catch (err) {
      console.error("[useUpdateReservation] Error updating reservation:", err);
      const errorMessage = err instanceof Error ? err.message : "예약 수정 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updateReservation,
    updating,
    error,
  };
}

/**
 * 예약 삭제 훅
 */
export function useDeleteReservation() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReservation = useCallback(async (id: number) => {
    try {
      setDeleting(true);
      setError(null);

      await window.api.db.deleteReservation(id);

      return { success: true };
    } catch (err) {
      console.error("[useDeleteReservation] Error deleting reservation:", err);
      const errorMessage = err instanceof Error ? err.message : "예약 삭제 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    deleteReservation,
    deleting,
    error,
  };
}

/**
 * 가능한 시간대 조회 훅
 */
export function useAvailableTimeSlots(date: string, staffId?: number, serviceDuration?: number) {
  const [slots, setSlots] = useState<AvailableTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await window.api.reservation.getAvailableSlots(date, staffId, serviceDuration);
      setSlots(data);
    } catch (err) {
      console.error("[useAvailableTimeSlots] Error fetching available slots:", err);
      setError(err instanceof Error ? err.message : "가능한 시간대 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [date, staffId, serviceDuration]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return {
    slots,
    loading,
    error,
    refetch: fetchSlots,
  };
}

/**
 * 시간 충돌 검사 훅
 */
export function useCheckConflict() {
  const [checking, setChecking] = useState(false);

  const checkConflict = useCallback(async (date: string, startTime: string, endTime: string, staffId?: number, excludeReservationId?: number): Promise<ConflictCheck> => {
    try {
      setChecking(true);
      return await window.api.reservation.checkConflict(date, startTime, endTime, staffId, excludeReservationId);
    } catch (err) {
      console.error("[useCheckConflict] Error checking conflict:", err);
      throw err;
    } finally {
      setChecking(false);
    }
  }, []);

  return {
    checkConflict,
    checking,
  };
}

/**
 * 예약 가능한 직원 조회 훅
 */
export function useAvailableStaff(date: string, startTime: string, endTime: string, position?: string) {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await window.api.reservation.getAvailableStaff(date, startTime, endTime, position);
      setStaff(data);
    } catch (err) {
      console.error("[useAvailableStaff] Error fetching available staff:", err);
      setError(err instanceof Error ? err.message : "가능한 직원 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [date, startTime, endTime, position]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    refetch: fetchStaff,
  };
}
