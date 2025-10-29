/**
 * 서비스(시술 메뉴) 데이터 관리 Hook
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Service } from "@/types/electron";
import {
  QueryState,
  MutationState,
  UseQueryOptions,
  UseMutationOptions,
  DEFAULT_RETRY_OPTIONS,
  DEFAULT_CACHE_OPTIONS,
} from "./types";
import {
  retryAsync,
  formatErrorMessage,
  isIpcAvailable,
  cache,
  createCacheKey,
  devLog,
  logError,
} from "./utils";

// ========== Hook 반환 타입 ==========

export interface UseServicesResult {
  // 조회
  services: Service[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // 생성
  createService: (data: Omit<Service, "id">) => Promise<Service>;
  creating: boolean;
  createError: Error | null;

  // 수정
  updateService: (id: number, data: Partial<Service>) => Promise<Service>;
  updating: boolean;
  updateError: Error | null;

  // 삭제
  deleteService: (id: number) => Promise<void>;
  deleting: boolean;
  deleteError: Error | null;

  // 검색/필터링
  searchServices: (query: string) => Service[];
  filterByCategory: (category: string) => Service[];
  filterByPriceRange: (min: number, max: number) => Service[];

  // 카테고리
  categories: string[];
}

// ========== Hook 구현 ==========

export function useServices(
  options: UseQueryOptions<Service[]> = {}
): UseServicesResult {
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

  const [services, setServices] = useState<Service[]>(initialData);
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
  const cacheKey = "services:all";

  // ========== 데이터 조회 ==========

  const fetchServices = useCallback(async () => {
    if (!enabled || !isIpcAvailable()) {
      devLog("fetchServices skipped", { enabled, ipcAvailable: isIpcAvailable() });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 캐시 확인
      if (cacheOptions.enabled) {
        const cached = cache.get<Service[]>(cacheKey, cacheOptions.ttl);
        if (cached) {
          devLog("Using cached services", cached.length);
          setServices(cached);
          setLoading(false);
          onSuccess?.(cached);
          return;
        }
      }

      // IPC 호출 with 재시도
      const data = await retryAsync(
        () => window.api.db.getServices(),
        retry
      );

      if (!isMountedRef.current) return;

      setServices(data);

      // 캐시 저장
      if (cacheOptions.enabled) {
        cache.set(cacheKey, data);
      }

      onSuccess?.(data);
      devLog("Services fetched", data.length);
    } catch (err) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      logError("fetchServices", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, retry, cacheOptions, onSuccess, onError]);

  // ========== 생성 ==========

  const createService = useCallback(
    async (data: Omit<Service, "id">): Promise<Service> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setCreating(true);
      setCreateError(null);

      try {
        const newService = await retryAsync(
          () => window.api.db.addService(data),
          retry
        );

        if (!isMountedRef.current) return newService;

        // 옵티미스틱 업데이트
        setServices((prev) => [...prev, newService]);

        // 캐시 무효화
        cache.clear(cacheKey);

        devLog("Service created", newService);
        return newService;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setCreateError(error);
        logError("createService", error);
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

  const updateService = useCallback(
    async (id: number, data: Partial<Service>): Promise<Service> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setUpdating(true);
      setUpdateError(null);

      try {
        const updatedService = await retryAsync(
          () => window.api.db.updateService(id, data),
          retry
        );

        if (!isMountedRef.current) return updatedService;

        // 옵티미스틱 업데이트
        setServices((prev) =>
          prev.map((s) => (s.id === id ? updatedService : s))
        );

        // 캐시 무효화
        cache.clear(cacheKey);

        devLog("Service updated", updatedService);
        return updatedService;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setUpdateError(error);
        logError("updateService", error);
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

  const deleteService = useCallback(
    async (id: number): Promise<void> => {
      if (!isIpcAvailable()) {
        throw new Error("IPC가 사용 불가능합니다.");
      }

      setDeleting(true);
      setDeleteError(null);

      try {
        await retryAsync(
          () => window.api.db.deleteService(id),
          retry
        );

        if (!isMountedRef.current) return;

        // 옵티미스틱 업데이트
        setServices((prev) => prev.filter((s) => s.id !== id));

        // 캐시 무효화
        cache.clear(cacheKey);

        devLog("Service deleted", id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setDeleteError(error);
        logError("deleteService", error);
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

  const searchServices = useCallback(
    (query: string): Service[] => {
      if (!query.trim()) return services;

      const lowerQuery = query.toLowerCase();
      return services.filter(
        (service) =>
          service.name.toLowerCase().includes(lowerQuery) ||
          service.category?.toLowerCase().includes(lowerQuery) ||
          service.description?.toLowerCase().includes(lowerQuery)
      );
    },
    [services]
  );

  const filterByCategory = useCallback(
    (category: string): Service[] => {
      if (!category) return services;
      return services.filter((s) => s.category === category);
    },
    [services]
  );

  const filterByPriceRange = useCallback(
    (min: number, max: number): Service[] => {
      return services.filter((s) => s.price >= min && s.price <= max);
    },
    [services]
  );

  // ========== 카테고리 목록 ==========

  const categories = useCallback(() => {
    const uniqueCategories = new Set(
      services.map((s) => s.category).filter(Boolean)
    );
    return Array.from(uniqueCategories);
  }, [services])();

  // ========== 초기 로드 ==========

  useEffect(() => {
    if (refetchOnMount) {
      fetchServices();
    }
  }, [refetchOnMount, fetchServices]);

  // ========== 클린업 ==========

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ========== 반환 ==========

  return {
    // 조회
    services,
    loading,
    error,
    refetch: fetchServices,

    // 생성
    createService,
    creating,
    createError,

    // 수정
    updateService,
    updating,
    updateError,

    // 삭제
    deleteService,
    deleting,
    deleteError,

    // 검색/필터링
    searchServices,
    filterByCategory,
    filterByPriceRange,

    // 카테고리
    categories,
  };
}
