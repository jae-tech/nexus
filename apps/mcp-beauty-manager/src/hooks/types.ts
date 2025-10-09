/**
 * 데이터 접근 계층 공통 타입 정의
 */

// ========== 공통 타입 ==========

export interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface MutationState {
  loading: boolean;
  error: Error | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ========== 에러 타입 ==========

export class IpcError extends Error {
  constructor(
    message: string,
    public readonly code: string = "IPC_ERROR",
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "IpcError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "네트워크 연결을 확인해주세요.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// ========== 재시도 옵션 ==========

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number; // ms
  exponentialBackoff: boolean;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
};

// ========== 캐시 옵션 ==========

export interface CacheOptions {
  enabled: boolean;
  ttl: number; // ms
}

export const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  enabled: true,
  ttl: 5 * 60 * 1000, // 5분
};

// ========== Hook 옵션 ==========

export interface UseQueryOptions<T> {
  initialData?: T;
  enabled?: boolean;
  refetchOnMount?: boolean;
  retry?: RetryOptions;
  cache?: CacheOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseMutationOptions<TData, TVariables> {
  retry?: RetryOptions;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  optimisticUpdate?: (variables: TVariables) => void;
}
