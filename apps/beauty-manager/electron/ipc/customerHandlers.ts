import { ipcMain } from 'electron';
import { database } from '../database/db';
import type { Customer } from '../types';

/**
 * Customer 관련 IPC 핸들러 등록
 */
export function registerCustomerHandlers() {
  // 전체 고객 조회
  ipcMain.handle('customer:getAll', async (): Promise<Customer[]> => {
    try {
      const customers = await database.all<Customer>(
        'SELECT * FROM customers ORDER BY name ASC'
      );
      return customers;
    } catch (error) {
      console.error('customer:getAll error:', error);
      throw error;
    }
  });

  // 고객 생성
  ipcMain.handle(
    'customer:create',
    async (_event, customer: Customer): Promise<void> => {
      try {
        await database.run(
          'INSERT INTO customers (id, name, phone, memo) VALUES (?, ?, ?, ?)',
          [customer.id, customer.name, customer.phone, customer.memo || null]
        );
      } catch (error) {
        console.error('customer:create error:', error);
        throw error;
      }
    }
  );

  // 고객 수정
  ipcMain.handle(
    'customer:update',
    async (_event, customer: Customer): Promise<void> => {
      try {
        await database.run(
          'UPDATE customers SET name = ?, phone = ?, memo = ? WHERE id = ?',
          [customer.name, customer.phone, customer.memo || null, customer.id]
        );
      } catch (error) {
        console.error('customer:update error:', error);
        throw error;
      }
    }
  );

  // 고객 삭제
  ipcMain.handle(
    'customer:delete',
    async (_event, id: string): Promise<void> => {
      try {
        await database.run('DELETE FROM customers WHERE id = ?', [id]);
      } catch (error) {
        console.error('customer:delete error:', error);
        throw error;
      }
    }
  );

  // 단일 고객 조회
  ipcMain.handle(
    'customer:getById',
    async (_event, id: string): Promise<Customer | null> => {
      try {
        const customer = await database.get<Customer>(
          'SELECT * FROM customers WHERE id = ?',
          [id]
        );
        return customer || null;
      } catch (error) {
        console.error('customer:getById error:', error);
        throw error;
      }
    }
  );
}
