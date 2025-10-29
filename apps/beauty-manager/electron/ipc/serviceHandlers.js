"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerServiceHandlers = registerServiceHandlers;
const electron_1 = require("electron");
const db_1 = require("../database/db");
/**
 * Service 관련 IPC 핸들러 등록
 */
function registerServiceHandlers() {
    // 전체 서비스 조회
    electron_1.ipcMain.handle('service:getAll', async () => {
        try {
            const services = await db_1.database.all('SELECT * FROM services ORDER BY name ASC');
            return services;
        }
        catch (error) {
            console.error('service:getAll error:', error);
            throw error;
        }
    });
    // 단일 서비스 조회
    electron_1.ipcMain.handle('service:getById', async (_event, id) => {
        try {
            const service = await db_1.database.get('SELECT * FROM services WHERE id = ?', [id]);
            return service || null;
        }
        catch (error) {
            console.error('service:getById error:', error);
            throw error;
        }
    });
    // 서비스 생성
    electron_1.ipcMain.handle('service:create', async (_event, service) => {
        try {
            await db_1.database.run('INSERT INTO services (id, name, category, price, duration) VALUES (?, ?, ?, ?, ?)', [service.id, service.name, service.category, service.price, service.duration]);
        }
        catch (error) {
            console.error('service:create error:', error);
            throw error;
        }
    });
    // 서비스 수정
    electron_1.ipcMain.handle('service:update', async (_event, service) => {
        try {
            await db_1.database.run('UPDATE services SET name = ?, category = ?, price = ?, duration = ? WHERE id = ?', [service.name, service.category, service.price, service.duration, service.id]);
        }
        catch (error) {
            console.error('service:update error:', error);
            throw error;
        }
    });
    // 서비스 삭제
    electron_1.ipcMain.handle('service:delete', async (_event, id) => {
        try {
            await db_1.database.run('DELETE FROM services WHERE id = ?', [id]);
        }
        catch (error) {
            console.error('service:delete error:', error);
            throw error;
        }
    });
}
