import { ipcMain } from 'electron';
import { database } from '../database/db';
import type { Appointment } from '../types';

/**
 * Appointment 관련 IPC 핸들러 등록
 */
export function registerAppointmentHandlers() {
  // 고객별 예약 조회
  ipcMain.handle('appointment:getAllByCustomerId', async (_event, customerId: string): Promise<Appointment[]> => {
    try {
      const appointments = await database.all<Appointment>(
        'SELECT * FROM appointments WHERE customerId = ? ORDER BY datetime DESC',
        [customerId]
      );
      return appointments;
    } catch (error) {
      console.error('appointment:getAllByCustomerId error:', error);
      throw error;
    }
  });

  // 전체 예약 조회
  ipcMain.handle('appointment:getAll', async (): Promise<Appointment[]> => {
    try {
      const appointments = await database.all<Appointment>(
        'SELECT * FROM appointments ORDER BY datetime DESC'
      );
      return appointments;
    } catch (error) {
      console.error('appointment:getAll error:', error);
      throw error;
    }
  });

  // 예약 생성
  ipcMain.handle('appointment:create', async (_event, appointment: Appointment): Promise<void> => {
    try {
      await database.run(
        'INSERT INTO appointments (id, customerId, datetime, service) VALUES (?, ?, ?, ?)',
        [appointment.id, appointment.customerId, appointment.datetime, appointment.service || null]
      );
    } catch (error) {
      console.error('appointment:create error:', error);
      throw error;
    }
  });

  // 예약 수정
  ipcMain.handle('appointment:update', async (_event, appointment: Appointment): Promise<void> => {
    try {
      await database.run(
        'UPDATE appointments SET customerId = ?, datetime = ?, service = ? WHERE id = ?',
        [appointment.customerId, appointment.datetime, appointment.service || null, appointment.id]
      );
    } catch (error) {
      console.error('appointment:update error:', error);
      throw error;
    }
  });

  // 예약 삭제
  ipcMain.handle('appointment:delete', async (_event, id: string): Promise<void> => {
    try {
      await database.run('DELETE FROM appointments WHERE id = ?', [id]);
    } catch (error) {
      console.error('appointment:delete error:', error);
      throw error;
    }
  });

  // 단일 예약 조회
  ipcMain.handle('appointment:getById', async (_event, id: string): Promise<Appointment | null> => {
    try {
      const appointment = await database.get<Appointment>(
        'SELECT * FROM appointments WHERE id = ?',
        [id]
      );
      return appointment || null;
    } catch (error) {
      console.error('appointment:getById error:', error);
      throw error;
    }
  });
}
