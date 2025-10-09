/**
 * 에러 처리 시스템
 *
 * 중앙집중식 에러 처리 및 복구 전략
 */

import { app, dialog, Notification } from "electron";
import { appLogger, logError } from "./logger";

// ========== 에러 타입 정의 ==========

export enum ErrorSeverity {
  LOW = "low", // 사용자에게 영향 없음
  MEDIUM = "medium", // 일부 기능 제한
  HIGH = "high", // 주요 기능 실패
  CRITICAL = "critical", // 앱 종료 필요
}

export interface AppError {
  severity: ErrorSeverity;
  code: string;
  message: string;
  userMessage: string;
  originalError?: Error;
  context?: any;
  timestamp: Date;
}

// ========== 에러 클래스 ==========

/**
 * 데이터베이스 에러
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string = "DB_ERROR",
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * IPC 에러
 */
export class IPCError extends Error {
  constructor(
    message: string,
    public readonly channel: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "IPCError";
  }
}

/**
 * 파일 시스템 에러
 */
export class FileSystemError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "FileSystemError";
  }
}

// ========== 에러 핸들러 ==========

/**
 * 에러 심각도 결정
 */
function determineSeverity(error: Error): ErrorSeverity {
  if (error instanceof DatabaseError) {
    // 데이터베이스 에러는 일반적으로 심각
    if (error.code === "SQLITE_CANTOPEN" || error.code === "SQLITE_CORRUPT") {
      return ErrorSeverity.CRITICAL;
    }
    return ErrorSeverity.HIGH;
  }

  if (error instanceof FileSystemError) {
    return ErrorSeverity.MEDIUM;
  }

  if (error instanceof IPCError) {
    return ErrorSeverity.MEDIUM;
  }

  // 기본값
  return ErrorSeverity.MEDIUM;
}

/**
 * 사용자 친화적 메시지 생성
 */
function createUserMessage(error: Error): string {
  if (error instanceof DatabaseError) {
    return "데이터베이스 작업 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  if (error instanceof FileSystemError) {
    return "파일 시스템 작업 중 오류가 발생했습니다. 권한을 확인해주세요.";
  }

  if (error instanceof IPCError) {
    return "작업 처리 중 오류가 발생했습니다. 다시 시도해주세요.";
  }

  return "예기치 않은 오류가 발생했습니다. 다시 시도해주세요.";
}

/**
 * 에러 처리
 */
export function handleError(error: Error, context?: string): AppError {
  const severity = determineSeverity(error);
  const userMessage = createUserMessage(error);

  const appError: AppError = {
    severity,
    code: error.name,
    message: error.message,
    userMessage,
    originalError: error,
    context,
    timestamp: new Date(),
  };

  // 로그 기록
  logError(context || "Unknown", error);

  // 심각도에 따른 처리
  switch (severity) {
    case ErrorSeverity.LOW:
      // 로그만 기록
      break;

    case ErrorSeverity.MEDIUM:
      // 사용자에게 알림
      showErrorNotification(appError);
      break;

    case ErrorSeverity.HIGH:
      // 다이얼로그 표시
      showErrorDialog(appError);
      break;

    case ErrorSeverity.CRITICAL:
      // 크리티컬 에러 처리
      handleCriticalError(appError);
      break;
  }

  return appError;
}

/**
 * 에러 알림 표시
 */
function showErrorNotification(error: AppError): void {
  try {
    new Notification({
      title: "오류 발생",
      body: error.userMessage,
      urgency: "normal",
    }).show();
  } catch (notificationError) {
    appLogger.error("Failed to show error notification", notificationError);
  }
}

/**
 * 에러 다이얼로그 표시
 */
function showErrorDialog(error: AppError, options?: { retry?: () => void }): void {
  const buttons = ["확인"];
  if (options?.retry) {
    buttons.unshift("다시 시도");
  }

  dialog
    .showMessageBox({
      type: "error",
      title: "오류",
      message: error.userMessage,
      detail:
        process.env.NODE_ENV === "development"
          ? `${error.code}: ${error.message}`
          : undefined,
      buttons,
      defaultId: 0,
    })
    .then((result) => {
      if (result.response === 0 && options?.retry) {
        try {
          options.retry();
        } catch (retryError) {
          appLogger.error("Retry failed", retryError);
        }
      }
    });
}

/**
 * 크리티컬 에러 처리
 */
function handleCriticalError(error: AppError): void {
  appLogger.error("Critical error occurred", error);

  dialog
    .showMessageBox({
      type: "error",
      title: "치명적 오류",
      message: "앱을 계속 실행할 수 없습니다.",
      detail: error.userMessage,
      buttons: ["종료", "재시작"],
      defaultId: 1,
    })
    .then((result) => {
      if (result.response === 1) {
        app.relaunch();
      }
      app.quit();
    });
}

// ========== IPC 에러 핸들러 래퍼 ==========

/**
 * 안전한 IPC 핸들러
 */
export function safeIpcHandler<T extends (...args: any[]) => any>(
  channel: string,
  handler: T,
  options?: {
    retry?: boolean;
    userMessage?: string;
  }
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      const result = await handler(...args);
      return result;
    } catch (error) {
      // IPCError로 래핑
      const ipcError = new IPCError(
        options?.userMessage || "IPC 요청 처리 실패",
        channel,
        error instanceof Error ? error : new Error(String(error))
      );

      // 에러 처리
      const appError = handleError(ipcError, `IPC:${channel}`);

      // 사용자 친화적 에러 메시지로 변환하여 throw
      throw new Error(appError.userMessage);
    }
  };
}

// ========== 크래시 리포트 ==========

/**
 * 크래시 정보 수집
 */
export interface CrashReport {
  timestamp: string;
  version: string;
  platform: string;
  arch: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  systemInfo: {
    totalMemory: number;
    freeMemory: number;
    uptime: number;
  };
  // 개인정보는 포함하지 않음
}

/**
 * 크래시 리포트 생성
 */
export function createCrashReport(error: Error): CrashReport {
  const os = require("os");

  return {
    timestamp: new Date().toISOString(),
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    },
    systemInfo: {
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
    },
  };
}

/**
 * 크래시 리포트 저장
 */
export function saveCrashReport(report: CrashReport): void {
  try {
    const fs = require("fs");
    const path = require("path");

    const crashDir = path.join(app.getPath("userData"), "crashes");
    if (!fs.existsSync(crashDir)) {
      fs.mkdirSync(crashDir, { recursive: true });
    }

    const filename = `crash-${Date.now()}.json`;
    const filepath = path.join(crashDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    appLogger.info(`Crash report saved: ${filepath}`);
  } catch (error) {
    appLogger.error("Failed to save crash report", error);
  }
}

// ========== 전역 에러 핸들러 ==========

/**
 * 전역 에러 핸들러 등록
 */
export function registerGlobalErrorHandlers(): void {
  // 처리되지 않은 예외
  process.on("uncaughtException", (error: Error) => {
    appLogger.error("Uncaught exception", error);

    const report = createCrashReport(error);
    saveCrashReport(report);

    handleCriticalError({
      severity: ErrorSeverity.CRITICAL,
      code: "UNCAUGHT_EXCEPTION",
      message: error.message,
      userMessage: "예기치 않은 오류가 발생했습니다.",
      originalError: error,
      timestamp: new Date(),
    });
  });

  // 처리되지 않은 Promise 거부
  process.on("unhandledRejection", (reason: any) => {
    appLogger.error("Unhandled rejection", reason);

    const error =
      reason instanceof Error ? reason : new Error(String(reason));

    const report = createCrashReport(error);
    saveCrashReport(report);
  });

  // 렌더러 프로세스 크래시
  app.on("render-process-gone", (event, webContents, details) => {
    appLogger.error("Renderer process gone", details);

    if (details.reason === "crashed") {
      dialog
        .showMessageBox({
          type: "error",
          title: "프로세스 오류",
          message: "렌더러 프로세스가 예기치 않게 종료되었습니다.",
          buttons: ["재시작", "종료"],
        })
        .then((result) => {
          if (result.response === 0) {
            app.relaunch();
          }
          app.quit();
        });
    }
  });

  appLogger.info("Global error handlers registered");
}

// ========== 복구 가능한 에러 처리 ==========

/**
 * 자동 복구 시도
 */
export async function tryRecover(
  operation: () => Promise<any>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      appLogger.debug(`Attempt ${attempt}/${maxRetries}`);
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      appLogger.warn(`Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  // 모든 재시도 실패
  if (lastError) {
    throw lastError;
  }
}
