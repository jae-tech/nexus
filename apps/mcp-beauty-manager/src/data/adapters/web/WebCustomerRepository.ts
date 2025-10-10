import type { ICustomerRepository } from '@/data/interfaces/ICustomerRepository'
import type { Customer, CreateCustomerDTO } from '@/types/data'

/**
 * Web API 환경용 Customer Repository
 * HTTP 통신을 통해 백엔드 서버에 접근
 */
export class WebCustomerRepository implements ICustomerRepository {
  private readonly baseUrl = '/api/customers'

  async getAll(): Promise<Customer[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const customers = await response.json()
      return customers
    } catch (error) {
      console.error('[WebCustomerRepository] getAll 실패:', error)
      throw new Error('고객 목록을 불러오는데 실패했습니다.')
    }
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const customer = await response.json()
      return customer
    } catch (error) {
      console.error('[WebCustomerRepository] create 실패:', error)
      throw new Error('고객 생성에 실패했습니다.')
    }
  }
}
