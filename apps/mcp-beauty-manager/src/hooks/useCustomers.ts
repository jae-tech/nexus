/**
 * 고객 데이터 관리 Hook
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Customer } from "@/types/electron";
import {
  QueryState,
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

export interface UseCustomersResult {
  // 조회
  customers: Customer[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // 생성
  createCustomer: (data: Omit<Customer, "id">) => Promise<Customer>;
  creating: boolean;
  createError: Error | null;

  // 수정
  updateCustomer: (id: number, data: Partial<Customer>) => Promise<Customer>;
  updating: boolean;
  updateError: Error | null;

  // 삭제
  deleteCustomer: (id: number) => Promise<void>;
  deleting: boolean;
  deleteError: Error | null;

  // 검색/필터링
  searchCustomers: (query: string) => Customer[];
  filterByGender: (gender: "male" | "female") => Customer[];
  sortByName: (order: "asc" | "desc") => Customer[];

  // 통계
  getCustomerStats: (customerId: number) => Promise<any>;
  getVisitHistory: (customerId: number) => Promise<any[]>;
}

// ========== Hook 구현 ==========

export function useCustomers(
  options: UseQueryOptions<Customer[]> = {}
): UseCustomersResult {
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

  const [customers, setCustomers] = useState<Customer[]>(initialData);
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
  const cacheKey = "customers:all";

  // ========== 데이터 조회 ==========

  const fetchCustomers = useCallback(async () => {
    if (!enabled || !isIpcAvailable()) {
      devLog("fetchCustomers skipped");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 캐시 확인
      if (cacheOptions.enabled) {
        const cached = cache.get<Customer[]>(cacheKey, cacheOptions.ttl);
        if (cached) {
          devLog("Using cached customers", cached.length);
          setCustomers(cached);
          setLoading(false);
          onSuccess?.(cached);
          return;
        }
      }

      // IPC 호출
      const data = await retryAsync(
        () => window.api.db.getCustomers(),
        retry
      );

      if (!isMountedRef.current) return;

      setCustomers(data);

      // 캐시 저장
      if (cacheOptions.enabled) {
        cache.set(cacheKey, data);
      }

      onSuccess?.(data);
      devLog("Customers fetched", data.length);
    } catch (err) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      logError("fetchCustomers", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, retry, cacheOptions, onSuccess, onError]);

  // ========== 생성 ==========

  const createCustomer = useCallback(
    async (data: Omit<Customer, "id">): Promise<Customer> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setCreating(true);
      setCreateError(null);

      try {
        const newCustomer = await retryAsync(
          () => window.api.db.addCustomer(data),
          retry
        );

        if (!isMountedRef.current) return newCustomer;

        // 옵티미스틱 업데이트
        setCustomers((prev) => [...prev, newCustomer]);
        cache.clear(cacheKey);

        devLog("Customer created", newCustomer);
        return newCustomer;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setCreateError(error);
        logError("createCustomer", error);
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

  const updateCustomer = useCallback(
    async (id: number, data: Partial<Customer>): Promise<Customer> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setUpdating(true);
      setUpdateError(null);

      try {
        const updatedCustomer = await retryAsync(
          () => window.api.db.updateCustomer(id, data),
          retry
        );

        if (!isMountedRef.current) return updatedCustomer;

        // 옵티미스틱 업데이트
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? updatedCustomer : c))
        );
        cache.clear(cacheKey);

        devLog("Customer updated", updatedCustomer);
        return updatedCustomer;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setUpdateError(error);
        logError("updateCustomer", error);
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

  const deleteCustomer = useCallback(
    async (id: number): Promise<void> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setDeleting(true);
      setDeleteError(null);

      try {
        await retryAsync(
          () => window.api.db.deleteCustomer(id),
          retry
        );

        if (!isMountedRef.current) return;

        // 옵티미스틱 업데이트
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        cache.clear(cacheKey);

        devLog("Customer deleted", id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setDeleteError(error);
        logError("deleteCustomer", error);
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

  const searchCustomers = useCallback(
    (query: string): Customer[] => {
      if (!query.trim()) return customers;

      const lowerQuery = query.toLowerCase();
      return customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowerQuery) ||
          customer.phone?.toLowerCase().includes(lowerQuery) ||
          customer.email?.toLowerCase().includes(lowerQuery)
      );
    },
    [customers]
  );

  const filterByGender = useCallback(
    (gender: "male" | "female"): Customer[] => {
      return customers.filter((c) => c.gender === gender);
    },
    [customers]
  );

  const sortByName = useCallback(
    (order: "asc" | "desc"): Customer[] => {
      return [...customers].sort((a, b) => {
        if (order === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    },
    [customers]
  );

  // ========== 통계 및 이력 ==========

  const getCustomerStats = useCallback(
    async (customerId: number): Promise<any> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      try {
        return await retryAsync(
          () => window.api.db.getCustomerStats(customerId),
          retry
        );
      } catch (err) {
        logError("getCustomerStats", err as Error);
        throw err;
      }
    },
    [retry]
  );

  const getVisitHistory = useCallback(
    async (customerId: number): Promise<any[]> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      try {
        return await retryAsync(
          () => window.api.db.getCustomerVisitHistory(customerId),
          retry
        );
      } catch (err) {
        logError("getVisitHistory", err as Error);
        throw err;
      }
    },
    [retry]
  );

  // ========== 초기 로드 ==========

  useEffect(() => {
    if (refetchOnMount) {
      fetchCustomers();
    }
  }, [refetchOnMount, fetchCustomers]);

  // ========== 클린업 ==========

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ========== 반환 ==========

  return {
    // 조회
    customers,
    loading,
    error,
    refetch: fetchCustomers,

    // 생성
    createCustomer,
    creating,
    createError,

    // 수정
    updateCustomer,
    updating,
    updateError,

    // 삭제
    deleteCustomer,
    deleting,
    deleteError,

    // 검색/필터링
    searchCustomers,
    filterByGender,
    sortByName,

    // 통계
    getCustomerStats,
    getVisitHistory,
  };
}
