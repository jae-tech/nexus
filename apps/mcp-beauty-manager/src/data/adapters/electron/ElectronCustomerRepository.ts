import type { ICustomerRepository } from '@/data/interfaces/ICustomerRepository'
import type { Customer, CreateCustomerDTO } from '@/types/data'

/**
 * Electron 환경용 Customer Repository
 * IPC 통신을 통해 메인 프로세스의 SQLite3에 접근
 */
export class ElectronCustomerRepository implements ICustomerRepository {
  async getAll(): Promise<Customer[]> {
    try {
      const customers = await window.api.invoke('customer:getAll')
      return customers
    } catch (error) {
      console.error('[ElectronCustomerRepository] getAll 실패:', error)
      throw new Error('고객 목록을 불러오는데 실패했습니다.')
    }
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    try {
      const customer = await window.api.invoke('customer:create', data)
      return customer
    } catch (error) {
      console.error('[ElectronCustomerRepository] create 실패:', error)
      throw new Error('고객 생성에 실패했습니다.')
    }
  }
}

/**
 * Electron API 타입 정의
 */
declare global {
  interface Window {
    api: {
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }
  }
}
