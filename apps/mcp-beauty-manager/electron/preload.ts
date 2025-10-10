import { contextBridge, ipcRenderer } from 'electron';
import type { Customer, Appointment } from './types';

// IPC API 타입 정의
export interface ElectronAPI {
  db: {
    getCustomers: () => Promise<Customer[]>;
    getCustomerById: (id: number) => Promise<Customer | null>;
    getStaff: () => Promise<any[]>;
    getServices: () => Promise<any[]>;
  };
  customer: {
    getAll: () => Promise<Customer[]>;
    getById: (id: string) => Promise<Customer | null>;
    create: (customer: Customer) => Promise<void>;
    update: (customer: Customer) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  appointments: {
    getAll: () => Promise<Appointment[]>;
    getAllByCustomerId: (customerId: string) => Promise<Appointment[]>;
    getById: (id: string) => Promise<Appointment | null>;
    create: (appointment: Appointment) => Promise<void>;
    update: (appointment: Appointment) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
}

// 안전한 IPC API 노출 (window.api로 통일)
contextBridge.exposeInMainWorld('api', {
  db: {
    getCustomers: () => ipcRenderer.invoke('customer:getAll'),
    getCustomerById: (id: number) => ipcRenderer.invoke('customer:getById', id.toString()),
    getStaff: () => ipcRenderer.invoke('staff:getAll'),
    getServices: () => ipcRenderer.invoke('service:getAll'),
  },
  customer: {
    getAll: () => ipcRenderer.invoke('customer:getAll'),
    getById: (id: string) => ipcRenderer.invoke('customer:getById', id),
    create: (customer: Customer) => ipcRenderer.invoke('customer:create', customer),
    update: (customer: Customer) => ipcRenderer.invoke('customer:update', customer),
    delete: (id: string) => ipcRenderer.invoke('customer:delete', id),
  },
  appointments: {
    getAll: () => ipcRenderer.invoke('appointment:getAll'),
    getAllByCustomerId: (customerId: string) =>
      ipcRenderer.invoke('appointment:getAllByCustomerId', customerId),
    getById: (id: string) => ipcRenderer.invoke('appointment:getById', id),
    create: (appointment: Appointment) =>
      ipcRenderer.invoke('appointment:create', appointment),
    update: (appointment: Appointment) =>
      ipcRenderer.invoke('appointment:update', appointment),
    delete: (id: string) => ipcRenderer.invoke('appointment:delete', id),
  },
} as ElectronAPI);
