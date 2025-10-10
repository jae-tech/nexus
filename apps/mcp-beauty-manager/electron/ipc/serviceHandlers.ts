import { ipcMain } from 'electron';
import { database } from '../database/db';

/**
 * Service 관련 IPC 핸들러 등록
 */
export function registerServiceHandlers() {
  // 전체 서비스 조회
  ipcMain.handle('service:getAll', async (): Promise<any[]> => {
    try {
      const services = await database.all(
        'SELECT * FROM services ORDER BY name ASC'
      );
      return services;
    } catch (error) {
      console.error('service:getAll error:', error);
      throw error;
    }
  });

  // 단일 서비스 조회
  ipcMain.handle(
    'service:getById',
    async (_event, id: string): Promise<any | null> => {
      try {
        const service = await database.get(
          'SELECT * FROM services WHERE id = ?',
          [id]
        );
        return service || null;
      } catch (error) {
        console.error('service:getById error:', error);
        throw error;
      }
    }
  );

  // 서비스 생성
  ipcMain.handle(
    'service:create',
    async (_event, service: any): Promise<void> => {
      try {
        await database.run(
          'INSERT INTO services (id, name, category, price, duration) VALUES (?, ?, ?, ?, ?)',
          [service.id, service.name, service.category, service.price, service.duration]
        );
      } catch (error) {
        console.error('service:create error:', error);
        throw error;
      }
    }
  );

  // 서비스 수정
  ipcMain.handle(
    'service:update',
    async (_event, service: any): Promise<void> => {
      try {
        await database.run(
          'UPDATE services SET name = ?, category = ?, price = ?, duration = ? WHERE id = ?',
          [service.name, service.category, service.price, service.duration, service.id]
        );
      } catch (error) {
        console.error('service:update error:', error);
        throw error;
      }
    }
  );

  // 서비스 삭제
  ipcMain.handle(
    'service:delete',
    async (_event, id: string): Promise<void> => {
      try {
        await database.run('DELETE FROM services WHERE id = ?', [id]);
      } catch (error) {
        console.error('service:delete error:', error);
        throw error;
      }
    }
  );
}
