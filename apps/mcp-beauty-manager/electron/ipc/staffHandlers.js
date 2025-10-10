"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStaffHandlers = registerStaffHandlers;
const electron_1 = require("electron");
const db_1 = require("../database/db");
/**
 * Staff 관련 IPC 핸들러 등록
 */
function registerStaffHandlers() {
    // 전체 직원 조회
    electron_1.ipcMain.handle('staff:getAll', async () => {
        try {
            const staff = await db_1.database.all('SELECT * FROM staff ORDER BY name ASC');
            return staff;
        }
        catch (error) {
            console.error('staff:getAll error:', error);
            throw error;
        }
    });
    // 단일 직원 조회
    electron_1.ipcMain.handle('staff:getById', async (_event, id) => {
        try {
            const member = await db_1.database.get('SELECT * FROM staff WHERE id = ?', [id]);
            return member || null;
        }
        catch (error) {
            console.error('staff:getById error:', error);
            throw error;
        }
    });
    // 직원 생성
    electron_1.ipcMain.handle('staff:create', async (_event, staff) => {
        try {
            await db_1.database.run('INSERT INTO staff (id, name, position, phone, email) VALUES (?, ?, ?, ?, ?)', [staff.id, staff.name, staff.position, staff.phone, staff.email || null]);
        }
        catch (error) {
            console.error('staff:create error:', error);
            throw error;
        }
    });
    // 직원 수정
    electron_1.ipcMain.handle('staff:update', async (_event, staff) => {
        try {
            await db_1.database.run('UPDATE staff SET name = ?, position = ?, phone = ?, email = ? WHERE id = ?', [staff.name, staff.position, staff.phone, staff.email || null, staff.id]);
        }
        catch (error) {
            console.error('staff:update error:', error);
            throw error;
        }
    });
    // 직원 삭제
    electron_1.ipcMain.handle('staff:delete', async (_event, id) => {
        try {
            await db_1.database.run('DELETE FROM staff WHERE id = ?', [id]);
        }
        catch (error) {
            console.error('staff:delete error:', error);
            throw error;
        }
    });
}
