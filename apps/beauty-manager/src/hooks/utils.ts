/**
 * 데이터 접근 계층 유틸리티 함수
 */

import { RetryOptions, DEFAULT_RETRY_OPTIONS, IpcError, NetworkError } from "./types";

// ========== 재시도 로직 ==========

/**
 * 비동기 작업을 재시도하는 유틸리티
 */
export async function retryAsync<T>(
  operation: () => Promise<T>,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 마지막 시도가 아니면 재시도
      if (attempt < options.maxRetries) {
        const delay = options.exponentialBackoff
          ? options.retryDelay * Math.pow(2, attempt - 1)
          : options.retryDelay;

        console.log(
          `[Retry] Attempt ${attempt} failed, retrying in ${delay}ms...`,
          lastError.message
        );

        await sleep(delay);
      }
    }
  }

  // 모든 재시도 실패
  throw new IpcError(
    `작업 실패: ${lastError?.message || "알 수 없는 오류"}`,
    "RETRY_EXHAUSTED",
    lastError || undefined
  );
}

/**
 * Sleep 유틸리티
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ========== 에러 처리 ==========

/**
 * IPC 에러를 사용자 친화적 메시지로 변환
 */
export function formatErrorMessage(error: Error): string {
  if (error instanceof NetworkError) {
    return "네트워크 연결을 확인해주세요.";
  }

  if (error instanceof IpcError) {
    return error.message || "데이터를 불러오는 중 오류가 발생했습니다.";
  }

  // 일반 에러
  return error.message || "예기치 않은 오류가 발생했습니다.";
}

/**
 * 온라인 상태 확인
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * IPC 통신 가능 여부 확인
 */
export function isIpcAvailable(): boolean {
  return typeof window !== "undefined" && window.api !== undefined;
}

// ========== 캐시 관리 ==========

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private storage = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string, ttl: number): T | null {
    const entry = this.storage.get(key);

    if (!entry) {
      return null;
    }

    // TTL 확인
    const age = Date.now() - entry.timestamp;
    if (age > ttl) {
      this.storage.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(key?: string): void {
    if (key) {
      this.storage.delete(key);
    } else {
      this.storage.clear();
    }
  }

  has(key: string, ttl: number): boolean {
    return this.get(key, ttl) !== null;
  }
}

export const cache = new Cache();

/**
 * 캐시 키 생성
 */
export function createCacheKey(prefix: string, ...args: any[]): string {
  return `${prefix}:${JSON.stringify(args)}`;
}

// ========== 디바운스/쓰로틀 ==========

/**
 * Debounce 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ========== 데이터 검증 ==========

/**
 * 데이터 유효성 검증
 */
export function validateData<T>(data: T, validator: (data: T) => boolean): boolean {
  return validator(data);
}

/**
 * null/undefined 체크
 */
export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

// ========== 로깅 ==========

/**
 * 개발 모드에서만 로그 출력
 */
export function devLog(message: string, ...args: any[]): void {
  if (import.meta.env.DEV) {
    console.log(`[DataLayer] ${message}`, ...args);
  }
}

/**
 * 에러 로깅
 */
export function logError(context: string, error: Error): void {
  console.error(`[DataLayer:${context}]`, error);
}
