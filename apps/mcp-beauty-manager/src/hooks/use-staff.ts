/**
 * 직원 관리 커스텀 훅
 *
 * Electron DB와 연동된 직원 관리 기능
 */

import { useState, useEffect, useCallback } from "react";
import type {
  Staff,
  StaffPerformance,
  StaffDeletionImpact,
  ValidationResult,
  StaffReservationStatus,
  StaffWorkingHours,
} from "@/lib/api-types";

/**
 * 모든 직원 조회
 */
export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStaff = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.db.getStaff();
      setStaff(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
}

/**
 * 특정 직원 조회
 */
export function useStaffMember(staffId: number | null) {
  const [staffMember, setStaffMember] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!staffId || !window.api) {
      setLoading(false);
      return;
    }

    const fetchStaffMember = async () => {
      try {
        setLoading(true);
        const data = await window.api.db.getStaffById(staffId);
        setStaffMember(data || null);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMember();
  }, [staffId]);

  return { staffMember, loading, error };
}

/**
 * 직책별 직원 그룹핑
 */
export function useStaffByPosition() {
  const [staffByPosition, setStaffByPosition] = useState<Record<string, Staff[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStaffByPosition = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.staff.getByPosition();
      setStaffByPosition(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffByPosition();
  }, [fetchStaffByPosition]);

  return { staffByPosition, loading, error, refetch: fetchStaffByPosition };
}

/**
 * 직원 성과 분석
 */
export function useStaffPerformance(
  staffId?: number,
  startDate?: string,
  endDate?: string
) {
  const [performance, setPerformance] = useState<StaffPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPerformance = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.staff.analyzePerformance(staffId, startDate, endDate);
      setPerformance(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [staffId, startDate, endDate]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return { performance, loading, error, refetch: fetchPerformance };
}

/**
 * 직원 예약 현황
 */
export function useStaffReservationStatus(
  staffId: number | null,
  startDate?: string,
  endDate?: string
) {
  const [status, setStatus] = useState<StaffReservationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!staffId || !window.api) {
      setStatus(null);
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await window.api.staff.getReservationStatus(
          staffId,
          startDate,
          endDate
        );
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [staffId, startDate, endDate]);

  return { status, loading, error };
}

/**
 * 직원 생성
 */
export function useCreateStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createStaff = useCallback(async (staff: Omit<Staff, "id">) => {
    if (!window.api) {
      throw new Error("Electron API not available");
    }

    try {
      setLoading(true);
      setError(null);

      // 직원 검증
      const validation: ValidationResult = await window.api.staff.validate(staff);
      if (!validation.valid) {
        throw new Error(validation.errors.join(", "));
      }

      // 직원 생성
      const staffId = await window.api.db.addStaff(staff);
      return staffId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createStaff, loading, error };
}

/**
 * 직원 수정
 */
export function useUpdateStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateStaff = useCallback(async (staffId: number, updates: Partial<Staff>) => {
    if (!window.api) {
      throw new Error("Electron API not available");
    }

    try {
      setLoading(true);
      setError(null);

      // 수정 검증
      const validation: ValidationResult = await window.api.staff.validateUpdate(
        staffId,
        updates
      );
      if (!validation.valid) {
        throw new Error(validation.errors.join(", "));
      }

      // 직원 수정
      await window.api.db.updateStaff(staffId, updates);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStaff, loading, error };
}

/**
 * 직원 삭제
 */
export function useDeleteStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteStaff = useCallback(async (staffId: number) => {
    if (!window.api) {
      throw new Error("Electron API not available");
    }

    try {
      setLoading(true);
      setError(null);

      // 삭제 영향 분석
      const impact: StaffDeletionImpact = await window.api.staff.analyzeDeletion(staffId);

      if (!impact.canDelete) {
        throw new Error(`직원을 삭제할 수 없습니다:\n${impact.warnings.join("\n")}`);
      }

      // 직원 삭제
      await window.api.db.deleteStaff(staffId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteStaff, loading, error };
}

/**
 * 직원 삭제 영향 분석
 */
export function useStaffDeletionImpact(staffId: number | null) {
  const [impact, setImpact] = useState<StaffDeletionImpact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!staffId || !window.api) {
      setImpact(null);
      return;
    }

    const analyzeImpact = async () => {
      try {
        setLoading(true);
        const data = await window.api.staff.analyzeDeletion(staffId);
        setImpact(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    analyzeImpact();
  }, [staffId]);

  return { impact, loading, error };
}

/**
 * 예약 재배정
 */
export function useReassignReservations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reassignReservations = useCallback(
    async (fromStaffId: number, toStaffId: number, startDate?: string) => {
      if (!window.api) {
        throw new Error("Electron API not available");
      }

      try {
        setLoading(true);
        setError(null);

        const reassignedCount = await window.api.staff.reassignReservations(
          fromStaffId,
          toStaffId,
          startDate
        );
        return reassignedCount;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { reassignReservations, loading, error };
}

/**
 * 직원 근무시간 통계
 */
export function useStaffWorkingHours(
  staffId: number | null,
  startDate: string,
  endDate: string
) {
  const [workingHours, setWorkingHours] = useState<StaffWorkingHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!staffId || !window.api) {
      setWorkingHours(null);
      setLoading(false);
      return;
    }

    const fetchWorkingHours = async () => {
      try {
        setLoading(true);
        const data = await window.api.staff.getWorkingHours(staffId, startDate, endDate);
        setWorkingHours(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingHours();
  }, [staffId, startDate, endDate]);

  return { workingHours, loading, error };
}

/**
 * TOP 성과 직원 조회
 */
export function useTopPerformers(limit: number = 5, startDate?: string, endDate?: string) {
  const [topPerformers, setTopPerformers] = useState<StaffPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTopPerformers = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.staff.getTopPerformers(limit, startDate, endDate);
      setTopPerformers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit, startDate, endDate]);

  useEffect(() => {
    fetchTopPerformers();
  }, [fetchTopPerformers]);

  return { topPerformers, loading, error, refetch: fetchTopPerformers };
}

/**
 * 직원 검색
 */
export function useSearchStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchStaff = useCallback(
    async (options: {
      query?: string;
      position?: string;
      sortBy?: "name" | "position" | "hire_date";
      sortOrder?: "asc" | "desc";
    }) => {
      if (!window.api) {
        throw new Error("Electron API not available");
      }

      try {
        setLoading(true);
        setError(null);

        const results = await window.api.staff.search(options);
        return results;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { searchStaff, loading, error };
}
