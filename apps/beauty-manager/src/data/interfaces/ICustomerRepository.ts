import type { Customer, CreateCustomerDTO } from '@/types/data'

/**
 * 고객 데이터 접근을 위한 Repository 인터페이스
 * Electron IPC와 Web API 구현체 모두 이 인터페이스를 따름
 */
export interface ICustomerRepository {
  /**
   * 모든 고객 조회
   */
  getAll(): Promise<Customer[]>

  /**
   * 고객 생성
   */
  create(data: CreateCustomerDTO): Promise<Customer>
}
