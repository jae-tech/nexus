/**
 * 사용자 데이터 관리
 */

import { app, dialog } from "electron";
import * as fs from "fs";
import * as path from "path";

export class UserDataManager {
  private userDataPath: string;
  private settingsPath: string;
  private backupDir: string;

  constructor() {
    // 사용자 데이터 디렉토리
    this.userDataPath = app.getPath("userData");

    // 설정 파일 경로
    this.settingsPath = path.join(this.userDataPath, "settings.json");

    // 백업 디렉토리
    this.backupDir = path.join(this.userDataPath, "backups");

    // 디렉토리 생성
    this.ensureDirectories();
  }

  /**
   * 필요한 디렉토리 생성
   */
  private ensureDirectories(): void {
    [this.userDataPath, this.backupDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * 사용자 데이터 경로 가져오기
   */
  public getUserDataPath(): string {
    return this.userDataPath;
  }

  /**
   * 데이터베이스 경로 가져오기
   */
  public getDatabasePath(): string {
    return path.join(this.userDataPath, "beauty-manager.db");
  }

  /**
   * 설정 로드
   */
  public loadSettings<T = any>(): T | null {
    try {
      if (fs.existsSync(this.settingsPath)) {
        const data = fs.readFileSync(this.settingsPath, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("[UserData] Failed to load settings:", error);
    }
    return null;
  }

  /**
   * 설정 저장
   */
  public saveSettings<T = any>(settings: T): boolean {
    try {
      fs.writeFileSync(this.settingsPath, JSON.stringify(settings, null, 2), "utf-8");
      console.log("[UserData] Settings saved successfully");
      return true;
    } catch (error) {
      console.error("[UserData] Failed to save settings:", error);
      return false;
    }
  }

  /**
   * 데이터베이스 백업 생성
   */
  public async createBackup(): Promise<string | null> {
    try {
      const dbPath = this.getDatabasePath();

      if (!fs.existsSync(dbPath)) {
        throw new Error("Database file not found");
      }

      // 백업 파일명: beauty-manager-backup-2024-01-15-143022.db
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").replace("T", "-").split(".")[0];
      const backupFileName = `beauty-manager-backup-${timestamp}.db`;
      const backupPath = path.join(this.backupDir, backupFileName);

      // 파일 복사
      fs.copyFileSync(dbPath, backupPath);

      console.log("[UserData] Backup created:", backupPath);
      return backupPath;
    } catch (error) {
      console.error("[UserData] Failed to create backup:", error);
      return null;
    }
  }

  /**
   * 자동 백업 (최대 개수 유지)
   */
  public async autoBackup(maxBackups: number = 10): Promise<void> {
    try {
      // 백업 생성
      await this.createBackup();

      // 오래된 백업 삭제
      const backups = this.listBackups();
      if (backups.length > maxBackups) {
        const toDelete = backups.slice(maxBackups);
        toDelete.forEach((backup) => {
          fs.unlinkSync(backup.path);
          console.log("[UserData] Deleted old backup:", backup.name);
        });
      }
    } catch (error) {
      console.error("[UserData] Auto backup failed:", error);
    }
  }

  /**
   * 백업 목록 조회
   */
  public listBackups(): Array<{ name: string; path: string; date: Date; size: number }> {
    try {
      if (!fs.existsSync(this.backupDir)) {
        return [];
      }

      const files = fs.readdirSync(this.backupDir);
      const backups = files
        .filter((file) => file.startsWith("beauty-manager-backup-") && file.endsWith(".db"))
        .map((file) => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            date: stats.mtime,
            size: stats.size,
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // 최신순 정렬

      return backups;
    } catch (error) {
      console.error("[UserData] Failed to list backups:", error);
      return [];
    }
  }

  /**
   * 백업에서 복원
   */
  public async restoreFromBackup(backupPath: string): Promise<boolean> {
    try {
      const dbPath = this.getDatabasePath();

      if (!fs.existsSync(backupPath)) {
        throw new Error("Backup file not found");
      }

      // 현재 데이터베이스 백업 (안전을 위해)
      const currentBackup = await this.createBackup();

      if (!currentBackup) {
        throw new Error("Failed to backup current database");
      }

      // 복원
      fs.copyFileSync(backupPath, dbPath);

      console.log("[UserData] Database restored from:", backupPath);
      return true;
    } catch (error) {
      console.error("[UserData] Failed to restore from backup:", error);
      return false;
    }
  }

  /**
   * 데이터 내보내기 (JSON)
   */
  public async exportData(data: any, filePath: string): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, jsonData, "utf-8");

      console.log("[UserData] Data exported to:", filePath);
      return true;
    } catch (error) {
      console.error("[UserData] Failed to export data:", error);
      return false;
    }
  }

  /**
   * 데이터 가져오기 (JSON)
   */
  public async importData<T = any>(filePath: string): Promise<T | null> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error("Import file not found");
      }

      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);

      console.log("[UserData] Data imported from:", filePath);
      return parsed;
    } catch (error) {
      console.error("[UserData] Failed to import data:", error);
      return null;
    }
  }

  /**
   * 캐시 디렉토리 경로
   */
  public getCachePath(): string {
    return path.join(this.userDataPath, "cache");
  }

  /**
   * 로그 디렉토리 경로
   */
  public getLogPath(): string {
    return path.join(this.userDataPath, "logs");
  }

  /**
   * 임시 디렉토리 경로
   */
  public getTempPath(): string {
    return path.join(this.userDataPath, "temp");
  }

  /**
   * 디스크 사용량 조회
   */
  public getDiskUsage(): {
    database: number;
    backups: number;
    total: number;
    formatted: {
      database: string;
      backups: string;
      total: string;
    };
  } {
    try {
      const dbPath = this.getDatabasePath();
      const databaseSize = fs.existsSync(dbPath) ? fs.statSync(dbPath).size : 0;

      const backups = this.listBackups();
      const backupsSize = backups.reduce((sum, backup) => sum + backup.size, 0);

      const totalSize = databaseSize + backupsSize;

      return {
        database: databaseSize,
        backups: backupsSize,
        total: totalSize,
        formatted: {
          database: this.formatBytes(databaseSize),
          backups: this.formatBytes(backupsSize),
          total: this.formatBytes(totalSize),
        },
      };
    } catch (error) {
      console.error("[UserData] Failed to get disk usage:", error);
      return {
        database: 0,
        backups: 0,
        total: 0,
        formatted: {
          database: "0 B",
          backups: "0 B",
          total: "0 B",
        },
      };
    }
  }

  /**
   * 바이트를 읽기 쉬운 형식으로 변환
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * 모든 사용자 데이터 삭제 (초기화)
   */
  public async clearAllData(): Promise<boolean> {
    try {
      // 백업 먼저 생성
      await this.createBackup();

      // 데이터베이스 삭제
      const dbPath = this.getDatabasePath();
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }

      // 설정 파일 삭제
      if (fs.existsSync(this.settingsPath)) {
        fs.unlinkSync(this.settingsPath);
      }

      console.log("[UserData] All data cleared");
      return true;
    } catch (error) {
      console.error("[UserData] Failed to clear data:", error);
      return false;
    }
  }
}
