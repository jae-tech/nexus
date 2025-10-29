"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAppointmentHandlers = registerAppointmentHandlers;
const electron_1 = require("electron");
const db_1 = require("../database/db");
/**
 * Appointment 관련 IPC 핸들러 등록
 */
function registerAppointmentHandlers() {
    // 고객별 예약 조회
    electron_1.ipcMain.handle('appointment:getAllByCustomerId', async (_event, customerId) => {
        try {
            const appointments = await db_1.database.all('SELECT * FROM appointments WHERE customerId = ? ORDER BY datetime DESC', [customerId]);
            return appointments;
        }
        catch (error) {
            console.error('appointment:getAllByCustomerId error:', error);
            throw error;
        }
    });
    // 전체 예약 조회
    electron_1.ipcMain.handle('appointment:getAll', async () => {
        try {
            const appointments = await db_1.database.all('SELECT * FROM appointments ORDER BY datetime DESC');
            return appointments;
        }
        catch (error) {
            console.error('appointment:getAll error:', error);
            throw error;
        }
    });
    // 예약 생성
    electron_1.ipcMain.handle('appointment:create', async (_event, appointment) => {
        try {
            await db_1.database.run('INSERT INTO appointments (id, customerId, datetime, service) VALUES (?, ?, ?, ?)', [appointment.id, appointment.customerId, appointment.datetime, appointment.service || null]);
        }
        catch (error) {
            console.error('appointment:create error:', error);
            throw error;
        }
    });
    // 예약 수정
    electron_1.ipcMain.handle('appointment:update', async (_event, appointment) => {
        try {
            await db_1.database.run('UPDATE appointments SET customerId = ?, datetime = ?, service = ? WHERE id = ?', [appointment.customerId, appointment.datetime, appointment.service || null, appointment.id]);
        }
        catch (error) {
            console.error('appointment:update error:', error);
            throw error;
        }
    });
    // 예약 삭제
    electron_1.ipcMain.handle('appointment:delete', async (_event, id) => {
        try {
            await db_1.database.run('DELETE FROM appointments WHERE id = ?', [id]);
        }
        catch (error) {
            console.error('appointment:delete error:', error);
            throw error;
        }
    });
    // 단일 예약 조회
    electron_1.ipcMain.handle('appointment:getById', async (_event, id) => {
        try {
            const appointment = await db_1.database.get('SELECT * FROM appointments WHERE id = ?', [id]);
            return appointment || null;
        }
        catch (error) {
            console.error('appointment:getById error:', error);
            throw error;
        }
    });
}
