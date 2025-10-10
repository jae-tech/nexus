import sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';

class Database {
  private db: sqlite3.Database | null = null;

  /**
   * 데이터베이스 초기화 및 연결
   */
  async initialize(): Promise<void> {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'beauty-manager.db');

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.createTables()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  /**
   * 테이블 생성
   */
  private async createTables(): Promise<void> {
    const customerTable = `
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        memo TEXT
      )
    `;

    const appointmentTable = `
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        customerId TEXT NOT NULL,
        datetime TEXT NOT NULL,
        service TEXT,
        FOREIGN KEY(customerId) REFERENCES customers(id) ON DELETE CASCADE
      )
    `;

    const staffTable = `
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT,
        phone TEXT
      )
    `;

    const servicesTable = `
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        price INTEGER
      )
    `;

    await this.run(customerTable);
    await this.run(appointmentTable);
    await this.run(staffTable);
    await this.run(servicesTable);
  }

  /**
   * SELECT 쿼리 실행 (단일 행)
   */
  get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  /**
   * SELECT 쿼리 실행 (다중 행)
   */
  all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  /**
   * INSERT, UPDATE, DELETE 쿼리 실행
   */
  run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * 데이터베이스 연결 종료
   */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.db = null;
          resolve();
        }
      });
    });
  }
}

export const database = new Database();
