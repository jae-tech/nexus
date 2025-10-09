/**
 * 서비스 관리 비즈니스 로직
 *
 * 서비스 CRUD, 가격 변경 이력, 인기도 분석 등
 */

import type { BeautyDatabase, Service } from "./database";

/**
 * 가격 변경 이력
 */
export interface PriceHistory {
  id?: number;
  service_id: number;
  old_price: number;
  new_price: number;
  changed_by?: string;
  changed_at: string;
  reason?: string;
}

/**
 * 서비스 통계
 */
export interface ServiceStats {
  service_id: number;
  service_name: string;
  category?: string;
  current_price: number;
  total_reservations: number;
  completed_reservations: number;
  total_revenue: number;
  avg_rating?: number;
  popularity_rank?: number;
}

/**
 * 서비스 삭제 영향 분석
 */
export interface ServiceDeletionImpact {
  canDelete: boolean;
  activeReservations: number;
  futureReservations: number;
  completedReservations: number;
  warnings: string[];
}

/**
 * 서비스 관리 비즈니스 로직
 */
export class ServiceLogic {
  private db: BeautyDatabase;

  constructor(db: BeautyDatabase) {
    this.db = db;
  }

  /**
   * 카테고리별 서비스 그룹핑
   */
  public getServicesByCategory(): Map<string, Service[]> {
    try {
      const services = this.db.getAllServices();
      const grouped = new Map<string, Service[]>();

      for (const service of services) {
        const category = service.category || "미분류";
        if (!grouped.has(category)) {
          grouped.set(category, []);
        }
        grouped.get(category)!.push(service);
      }

      return grouped;
    } catch (error) {
      console.error("[ServiceLogic] Error grouping services by category:", error);
      throw error;
    }
  }

  /**
   * 가격대별 서비스 조회
   */
  public getServicesByPriceRange(minPrice: number, maxPrice: number): Service[] {
    try {
      return this.db.getServicesByPriceRange(minPrice, maxPrice);
    } catch (error) {
      console.error("[ServiceLogic] Error fetching services by price range:", error);
      throw error;
    }
  }

  /**
   * 서비스 인기도 조회 (예약 횟수 기반)
   */
  public getServicePopularity(startDate?: string, endDate?: string): ServiceStats[] {
    try {
      const stats = this.db.getServiceStats(startDate, endDate);

      // 인기도 순위 계산
      const sorted = stats.sort((a, b) => b.total_bookings - a.total_bookings);

      return sorted.map((stat, index) => ({
        service_id: stat.id,
        service_name: stat.name,
        category: stat.category,
        current_price: stat.price,
        total_reservations: stat.total_bookings,
        completed_reservations: stat.completed_bookings,
        total_revenue: stat.total_revenue,
        popularity_rank: index + 1,
      }));
    } catch (error) {
      console.error("[ServiceLogic] Error calculating service popularity:", error);
      throw error;
    }
  }

  /**
   * 서비스 검색 (고급)
   */
  public searchServices(options: {
    query?: string;
    category?: string;
    priceRange?: [number, number];
    sortBy?: "name" | "price" | "popularity";
    sortOrder?: "asc" | "desc";
  }): Service[] {
    try {
      let services = this.db.getAllServices();

      // 카테고리 필터
      if (options.category) {
        services = services.filter((s) => s.category === options.category);
      }

      // 가격 범위 필터
      if (options.priceRange) {
        const [min, max] = options.priceRange;
        services = services.filter((s) => s.price >= min && s.price <= max);
      }

      // 검색어 필터
      if (options.query) {
        const query = options.query.toLowerCase();
        services = services.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description?.toLowerCase().includes(query) ||
            s.category?.toLowerCase().includes(query)
        );
      }

      // 정렬
      if (options.sortBy === "name") {
        services.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sortBy === "price") {
        services.sort((a, b) => a.price - b.price);
      }

      if (options.sortOrder === "desc") {
        services.reverse();
      }

      return services;
    } catch (error) {
      console.error("[ServiceLogic] Error searching services:", error);
      throw error;
    }
  }

  /**
   * 서비스 삭제 영향 분석
   */
  public analyzeServiceDeletion(serviceId: number): ServiceDeletionImpact {
    try {
      // 서비스 존재 확인
      const service = this.db.getServiceById(serviceId);
      if (!service) {
        return {
          canDelete: false,
          activeReservations: 0,
          futureReservations: 0,
          completedReservations: 0,
          warnings: ["서비스를 찾을 수 없습니다."],
        };
      }

      // 관련 예약 조회
      const today = new Date().toISOString().split("T")[0];
      const reservations = this.db.searchReservationsAdvanced({
        serviceId,
      });

      const activeReservations = reservations.filter(
        (r) => r.status === "pending" || r.status === "confirmed"
      ).length;

      const futureReservations = reservations.filter(
        (r) => r.reservation_date >= today && r.status !== "cancelled"
      ).length;

      const completedReservations = reservations.filter(
        (r) => r.status === "completed"
      ).length;

      const warnings: string[] = [];

      if (activeReservations > 0) {
        warnings.push(`${activeReservations}건의 활성 예약이 있습니다.`);
      }

      if (futureReservations > 0) {
        warnings.push(`${futureReservations}건의 미래 예약이 있습니다.`);
      }

      if (completedReservations > 0) {
        warnings.push(
          `${completedReservations}건의 완료된 예약 이력이 있습니다. 삭제 시 통계에서 제외됩니다.`
        );
      }

      return {
        canDelete: activeReservations === 0 && futureReservations === 0,
        activeReservations,
        futureReservations,
        completedReservations,
        warnings,
      };
    } catch (error) {
      console.error("[ServiceLogic] Error analyzing service deletion:", error);
      throw error;
    }
  }

  /**
   * 서비스 복제
   */
  public duplicateService(serviceId: number, newName: string): number {
    try {
      const original = this.db.getServiceById(serviceId);
      if (!original) {
        throw new Error("원본 서비스를 찾을 수 없습니다.");
      }

      const newService: Service = {
        name: newName,
        category: original.category,
        price: original.price,
        duration: original.duration,
        description: original.description,
      };

      return this.db.addService(newService);
    } catch (error) {
      console.error("[ServiceLogic] Error duplicating service:", error);
      throw error;
    }
  }

  /**
   * 일괄 가격 업데이트
   */
  public bulkUpdatePrices(updates: Array<{ serviceId: number; newPrice: number; reason?: string }>): void {
    try {
      for (const update of updates) {
        const service = this.db.getServiceById(update.serviceId);
        if (!service) continue;

        // 가격 변경
        this.db.updateService(update.serviceId, {
          price: update.newPrice,
        });

        // 가격 변경 이력은 별도 테이블이 필요하므로 추후 구현
        console.log(`[ServiceLogic] Price updated for service ${update.serviceId}: ${service.price} -> ${update.newPrice}`);
      }
    } catch (error) {
      console.error("[ServiceLogic] Error bulk updating prices:", error);
      throw error;
    }
  }

  /**
   * 카테고리별 평균 가격
   */
  public getCategoryAveragePrices(): Map<string, number> {
    try {
      const services = this.db.getAllServices();
      const categoryTotals = new Map<string, { total: number; count: number }>();

      for (const service of services) {
        const category = service.category || "미분류";
        if (!categoryTotals.has(category)) {
          categoryTotals.set(category, { total: 0, count: 0 });
        }
        const stats = categoryTotals.get(category)!;
        stats.total += service.price;
        stats.count += 1;
      }

      const averages = new Map<string, number>();
      for (const [category, stats] of categoryTotals) {
        averages.set(category, Math.round(stats.total / stats.count));
      }

      return averages;
    } catch (error) {
      console.error("[ServiceLogic] Error calculating category average prices:", error);
      throw error;
    }
  }

  /**
   * 서비스 수익성 분석
   */
  public analyzeServiceProfitability(startDate?: string, endDate?: string): Array<{
    service_id: number;
    service_name: string;
    total_revenue: number;
    reservation_count: number;
    avg_revenue_per_reservation: number;
    profitability_score: number;
  }> {
    try {
      const stats = this.db.getServiceStats(startDate, endDate);

      return stats
        .map((stat) => ({
          service_id: stat.id,
          service_name: stat.name,
          total_revenue: stat.total_revenue,
          reservation_count: stat.total_bookings,
          avg_revenue_per_reservation:
            stat.total_bookings > 0 ? stat.total_revenue / stat.total_bookings : 0,
          profitability_score: stat.total_revenue * stat.total_bookings, // 간단한 수익성 점수
        }))
        .sort((a, b) => b.profitability_score - a.profitability_score);
    } catch (error) {
      console.error("[ServiceLogic] Error analyzing service profitability:", error);
      throw error;
    }
  }

  /**
   * 서비스 추천 (고객 이력 기반)
   */
  public recommendServicesForCustomer(customerId: number, limit: number = 5): Service[] {
    try {
      // 고객의 과거 예약 이력 조회
      const history = this.db.getCustomerReservations(customerId);

      if (history.length === 0) {
        // 이력이 없으면 인기 서비스 추천
        const popular = this.db.getPopularServices(limit);
        return popular.map((p) => this.db.getServiceById(p.id)!).filter(Boolean);
      }

      // 과거 이용 서비스 카테고리 분석
      const usedCategories = new Set(history.map((h) => h.service_name));
      const allServices = this.db.getAllServices();

      // 같은 카테고리의 미이용 서비스 추천
      const recommendations = allServices
        .filter((s) => !usedCategories.has(s.name))
        .slice(0, limit);

      return recommendations;
    } catch (error) {
      console.error("[ServiceLogic] Error recommending services:", error);
      throw error;
    }
  }

  /**
   * 서비스 검증
   */
  public validateService(service: Omit<Service, "id">): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 이름 검증
    if (!service.name || service.name.trim().length === 0) {
      errors.push("서비스 이름은 필수입니다.");
    }

    // 가격 검증
    if (service.price < 0) {
      errors.push("가격은 0 이상이어야 합니다.");
    }

    // 소요시간 검증
    if (service.duration && service.duration < 0) {
      errors.push("소요시간은 0 이상이어야 합니다.");
    }

    // 중복 이름 검증
    const existing = this.db.getAllServices();
    if (existing.some((s) => s.name === service.name)) {
      errors.push("이미 존재하는 서비스 이름입니다.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 서비스 수정 검증
   */
  public validateServiceUpdate(
    serviceId: number,
    updates: Partial<Service>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 서비스 존재 확인
    const service = this.db.getServiceById(serviceId);
    if (!service) {
      errors.push("존재하지 않는 서비스입니다.");
      return { valid: false, errors };
    }

    // 이름 중복 검증
    if (updates.name) {
      const existing = this.db.getAllServices();
      if (existing.some((s) => s.id !== serviceId && s.name === updates.name)) {
        errors.push("이미 존재하는 서비스 이름입니다.");
      }
    }

    // 가격 검증
    if (updates.price !== undefined && updates.price < 0) {
      errors.push("가격은 0 이상이어야 합니다.");
    }

    // 소요시간 검증
    if (updates.duration !== undefined && updates.duration < 0) {
      errors.push("소요시간은 0 이상이어야 합니다.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
