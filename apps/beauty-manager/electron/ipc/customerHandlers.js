"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomerHandlers = registerCustomerHandlers;
const electron_1 = require("electron");
const db_1 = require("../database/db");
/**
 * Customer 관련 IPC 핸들러 등록
 */
function registerCustomerHandlers() {
    // 전체 고객 조회
    electron_1.ipcMain.handle('customer:getAll', async () => {
        try {
            const customers = await db_1.database.all('SELECT * FROM customers ORDER BY name ASC');
            return customers;
        }
        catch (error) {
            console.error('customer:getAll error:', error);
            throw error;
        }
    });
    // 고객 생성
    electron_1.ipcMain.handle('customer:create', async (_event, customer) => {
        try {
            await db_1.database.run('INSERT INTO customers (id, name, phone, memo) VALUES (?, ?, ?, ?)', [customer.id, customer.name, customer.phone, customer.memo || null]);
        }
        catch (error) {
            console.error('customer:create error:', error);
            throw error;
        }
    });
    // 고객 수정
    electron_1.ipcMain.handle('customer:update', async (_event, customer) => {
        try {
            await db_1.database.run('UPDATE customers SET name = ?, phone = ?, memo = ? WHERE id = ?', [customer.name, customer.phone, customer.memo || null, customer.id]);
        }
        catch (error) {
            console.error('customer:update error:', error);
            throw error;
        }
    });
    // 고객 삭제
    electron_1.ipcMain.handle('customer:delete', async (_event, id) => {
        try {
            await db_1.database.run('DELETE FROM customers WHERE id = ?', [id]);
        }
        catch (error) {
            console.error('customer:delete error:', error);
            throw error;
        }
    });
    // 단일 고객 조회
    electron_1.ipcMain.handle('customer:getById', async (_event, id) => {
        try {
            const customer = await db_1.database.get('SELECT * FROM customers WHERE id = ?', [id]);
            return customer || null;
        }
        catch (error) {
            console.error('customer:getById error:', error);
            throw error;
        }
    });
}
