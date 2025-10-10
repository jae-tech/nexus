"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// 안전한 IPC API 노출 (window.api로 통일)
electron_1.contextBridge.exposeInMainWorld('api', {
    db: {
        getCustomers: () => electron_1.ipcRenderer.invoke('customer:getAll'),
        getCustomerById: (id) => electron_1.ipcRenderer.invoke('customer:getById', id.toString()),
        getStaff: () => electron_1.ipcRenderer.invoke('staff:getAll'),
        getServices: () => electron_1.ipcRenderer.invoke('service:getAll'),
    },
    customer: {
        getAll: () => electron_1.ipcRenderer.invoke('customer:getAll'),
        getById: (id) => electron_1.ipcRenderer.invoke('customer:getById', id),
        create: (customer) => electron_1.ipcRenderer.invoke('customer:create', customer),
        update: (customer) => electron_1.ipcRenderer.invoke('customer:update', customer),
        delete: (id) => electron_1.ipcRenderer.invoke('customer:delete', id),
    },
    appointments: {
        getAll: () => electron_1.ipcRenderer.invoke('appointment:getAll'),
        getAllByCustomerId: (customerId) => electron_1.ipcRenderer.invoke('appointment:getAllByCustomerId', customerId),
        getById: (id) => electron_1.ipcRenderer.invoke('appointment:getById', id),
        create: (appointment) => electron_1.ipcRenderer.invoke('appointment:create', appointment),
        update: (appointment) => electron_1.ipcRenderer.invoke('appointment:update', appointment),
        delete: (id) => electron_1.ipcRenderer.invoke('appointment:delete', id),
    },
});
