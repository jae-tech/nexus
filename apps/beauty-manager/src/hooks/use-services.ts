/**
 * 서비스 관리 커스텀 훅
 *
 * Electron DB와 연동된 서비스 관리 기능
 */

import { useState, useEffect, useCallback } from "react";
import type {
  Service,
  ServiceStats,
  ServiceDeletionImpact,
  ValidationResult,
} from "@/lib/api-types";

/**
 * 모든 서비스 조회
 */
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.db.getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}

/**
 * 특정 서비스 조회
 */
export function useService(serviceId: number | null) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!serviceId || !window.api) {
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await window.api.db.getServiceById(serviceId);
        setService(data || null);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  return { service, loading, error };
}

/**
 * 카테고리별 서비스 그룹핑
 */
export function useServicesByCategory() {
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, Service[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServicesByCategory = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.service.getByCategory();
      setServicesByCategory(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServicesByCategory();
  }, [fetchServicesByCategory]);

  return { servicesByCategory, loading, error, refetch: fetchServicesByCategory };
}

/**
 * 서비스 인기도 통계
 */
export function useServiceStats(startDate?: string, endDate?: string) {
  const [stats, setStats] = useState<ServiceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.service.getPopularity(startDate, endDate);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

/**
 * 서비스 생성
 */
export function useCreateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createService = useCallback(async (service: Omit<Service, "id">) => {
    if (!window.api) {
      throw new Error("Electron API not available");
    }

    try {
      setLoading(true);
      setError(null);

      // 서비스 검증
      const validation: ValidationResult = await window.api.service.validate(service);
      if (!validation.valid) {
        throw new Error(validation.errors.join(", "));
      }

      // 서비스 생성
      const serviceId = await window.api.db.addService(service);
      return serviceId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createService, loading, error };
}

/**
 * 서비스 수정
 */
export function useUpdateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateService = useCallback(
    async (serviceId: number, updates: Partial<Service>) => {
      if (!window.api) {
        throw new Error("Electron API not available");
      }

      try {
        setLoading(true);
        setError(null);

        // 수정 검증
        const validation: ValidationResult = await window.api.service.validateUpdate(
          serviceId,
          updates
        );
        if (!validation.valid) {
          throw new Error(validation.errors.join(", "));
        }

        // 서비스 수정
        await window.api.db.updateService(serviceId, updates);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateService, loading, error };
}

/**
 * 서비스 삭제
 */
export function useDeleteService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteService = useCallback(async (serviceId: number) => {
    if (!window.api) {
      throw new Error("Electron API not available");
    }

    try {
      setLoading(true);
      setError(null);

      // 삭제 영향 분석
      const impact: ServiceDeletionImpact = await window.api.service.analyzeDeletion(serviceId);

      if (!impact.canDelete) {
        throw new Error(
          `서비스를 삭제할 수 없습니다:\n${impact.warnings.join("\n")}`
        );
      }

      // 서비스 삭제
      await window.api.db.deleteService(serviceId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteService, loading, error };
}

/**
 * 서비스 삭제 영향 분석
 */
export function useServiceDeletionImpact(serviceId: number | null) {
  const [impact, setImpact] = useState<ServiceDeletionImpact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!serviceId || !window.api) {
      setImpact(null);
      return;
    }

    const analyzeImpact = async () => {
      try {
        setLoading(true);
        const data = await window.api.service.analyzeDeletion(serviceId);
        setImpact(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    analyzeImpact();
  }, [serviceId]);

  return { impact, loading, error };
}

/**
 * 서비스 복제
 */
export function useDuplicateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const duplicateService = useCallback(
    async (serviceId: number, newName: string) => {
      if (!window.api) {
        throw new Error("Electron API not available");
      }

      try {
        setLoading(true);
        setError(null);

        const newServiceId = await window.api.service.duplicate(serviceId, newName);
        return newServiceId;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { duplicateService, loading, error };
}

/**
 * 일괄 가격 업데이트
 */
export function useBulkUpdatePrices() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkUpdatePrices = useCallback(
    async (updates: Array<{ serviceId: number; newPrice: number; reason?: string }>) => {
      if (!window.api) {
        throw new Error("Electron API not available");
      }

      try {
        setLoading(true);
        setError(null);

        await window.api.service.bulkUpdatePrices(updates);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { bulkUpdatePrices, loading, error };
}

/**
 * 카테고리별 평균 가격
 */
export function useCategoryAveragePrices() {
  const [avgPrices, setAvgPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAvgPrices = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.service.getCategoryAvgPrices();
      setAvgPrices(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvgPrices();
  }, [fetchAvgPrices]);

  return { avgPrices, loading, error, refetch: fetchAvgPrices };
}

/**
 * 서비스 수익성 분석
 */
export function useServiceProfitability(startDate?: string, endDate?: string) {
  const [profitability, setProfitability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfitability = useCallback(async () => {
    if (!window.api) {
      setError(new Error("Electron API not available"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await window.api.service.analyzeProfitability(startDate, endDate);
      setProfitability(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchProfitability();
  }, [fetchProfitability]);

  return { profitability, loading, error, refetch: fetchProfitability };
}

/**
 * 고객 맞춤 서비스 추천
 */
export function useServiceRecommendations(customerId: number | null, limit: number = 5) {
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!customerId || !window.api) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await window.api.service.recommendForCustomer(customerId, limit);
        setRecommendations(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [customerId, limit]);

  return { recommendations, loading, error };
}

/**
 * 서비스 검색
 */
export function useSearchServices() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchServices = useCallback(
    async (options: {
      query?: string;
      category?: string;
      priceRange?: [number, number];
      sortBy?: "name" | "price" | "popularity";
      sortOrder?: "asc" | "desc";
    }) => {
      if (!window.api) {
        throw new Error("Electron API not available");
      }

      try {
        setLoading(true);
        setError(null);

        const results = await window.api.service.search(options);
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

  return { searchServices, loading, error };
}
