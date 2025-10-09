/**
 * 로깅 시스템
 *
 * electron-log를 사용한 중앙집중식 로깅 시스템
 * - 파일 + 콘솔 출력
 * - 로그 레벨별 분류
 * - 카테고리별 로거
 */

import log from "electron-log";
import { app } from "electron";
import * as path from "path";

// ========== 로그 설정 ==========

/**
 * 로거 초기화
 */
export function initializeLogger(): void {
  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

  // 콘솔 로그 레벨
  log.transports.console.level = isDev ? "debug" : "warn";
  log.transports.console.format = "[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}";

  // 파일 로그 레벨
  log.transports.file.level = "info";
  log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

  // 로그 파일 위치
  const logPath = path.join(app.getPath("userData"), "logs");
  log.transports.file.resolvePathFn = () => path.join(logPath, "main.log");

  // 로그 파일 크기 제한 (10MB)
  log.transports.file.maxSize = 10 * 1024 * 1024;

  // 오래된 로그 파일 삭제 (30일 이상)
  log.transports.file.archiveLog = (oldLogFile: { path: string }) => {
    const fs = require("fs");
    const archivePath = oldLogFile.path.replace(".log", `-${Date.now()}.log`);
    fs.renameSync(oldLogFile.path, archivePath);

    // 30일 이상 된 로그 파일 삭제
    const files = fs.readdirSync(logPath);
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    files.forEach((file: string) => {
      if (!file.endsWith(".log")) return;

      const filePath = path.join(logPath, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtime.getTime();

      if (age > thirtyDays) {
        try {
          fs.unlinkSync(filePath);
          log.info(`Deleted old log file: ${file}`);
        } catch (error) {
          log.error(`Failed to delete old log: ${file}`, error);
        }
      }
    });
  };

  log.info("Logger initialized");
  log.info(`Log file location: ${logPath}`);
  log.info(`Environment: ${isDev ? "development" : "production"}`);
}

// ========== 카테고리별 로거 ==========

/**
 * 데이터베이스 로거
 */
export const dbLogger = {
  info: (message: string, ...args: any[]) => log.info(`[Database] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => log.warn(`[Database] ${message}`, ...args),
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      log.error(`[Database] ${message}`, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      log.error(`[Database] ${message}`, error);
    }
  },
  debug: (message: string, ...args: any[]) => log.debug(`[Database] ${message}`, ...args),
};

/**
 * IPC 로거
 */
export const ipcLogger = {
  info: (channel: string, ...args: any[]) => log.info(`[IPC:${channel}]`, ...args),
  warn: (channel: string, ...args: any[]) => log.warn(`[IPC:${channel}]`, ...args),
  error: (channel: string, error: any) => {
    if (error instanceof Error) {
      log.error(`[IPC:${channel}]`, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      log.error(`[IPC:${channel}]`, error);
    }
  },
  debug: (channel: string, ...args: any[]) => log.debug(`[IPC:${channel}]`, ...args),
  request: (channel: string, params?: any) => {
    log.debug(`[IPC:${channel}] Request`, params);
  },
  response: (channel: string, result: any) => {
    log.debug(`[IPC:${channel}] Response`, result);
  },
};

/**
 * 앱 로거
 */
export const appLogger = {
  info: (message: string, ...args: any[]) => log.info(`[App] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => log.warn(`[App] ${message}`, ...args),
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      log.error(`[App] ${message}`, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      log.error(`[App] ${message}`, error);
    }
  },
  debug: (message: string, ...args: any[]) => log.debug(`[App] ${message}`, ...args),
};

/**
 * 업데이터 로거
 */
export const updaterLogger = {
  info: (message: string, ...args: any[]) => log.info(`[Updater] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => log.warn(`[Updater] ${message}`, ...args),
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      log.error(`[Updater] ${message}`, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      log.error(`[Updater] ${message}`, error);
    }
  },
};

/**
 * 사용자 데이터 로거
 */
export const userDataLogger = {
  info: (message: string, ...args: any[]) => log.info(`[UserData] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => log.warn(`[UserData] ${message}`, ...args),
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      log.error(`[UserData] ${message}`, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      log.error(`[UserData] ${message}`, error);
    }
  },
};

// ========== 에러 로깅 헬퍼 ==========

/**
 * 상세 에러 로깅
 */
export function logError(context: string, error: unknown): void {
  if (error instanceof Error) {
    log.error(`[${context}] Error occurred`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else if (typeof error === "string") {
    log.error(`[${context}]`, error);
  } else {
    log.error(`[${context}] Unknown error`, error);
  }
}

/**
 * IPC 에러 로깅 (사용자 정보 제외)
 */
export function logIpcError(channel: string, error: unknown, sanitizeData?: boolean): void {
  const errorData: any = {
    channel,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof Error) {
    errorData.name = error.name;
    errorData.message = error.message;

    // 개발 모드에서만 스택 트레이스 포함
    if (process.env.NODE_ENV === "development") {
      errorData.stack = error.stack;
    }
  } else {
    errorData.error = String(error);
  }

  // 민감한 정보 제거
  if (sanitizeData) {
    delete errorData.stack;
  }

  log.error("[IPC Error]", errorData);
}

/**
 * 성능 로깅
 */
export class PerformanceLogger {
  private startTime: number;
  private context: string;

  constructor(context: string) {
    this.context = context;
    this.startTime = Date.now();
    log.debug(`[Performance:${context}] Started`);
  }

  end(metadata?: any): void {
    const duration = Date.now() - this.startTime;
    log.debug(`[Performance:${this.context}] Completed in ${duration}ms`, metadata);
  }
}

/**
 * 성능 측정 데코레이터
 */
export function measurePerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const perf = new PerformanceLogger(`${target.constructor.name}.${propertyKey}`);
    try {
      const result = await originalMethod.apply(this, args);
      perf.end();
      return result;
    } catch (error) {
      perf.end({ error: true });
      throw error;
    }
  };

  return descriptor;
}

// ========== 기본 로거 내보내기 ==========

export default log;
