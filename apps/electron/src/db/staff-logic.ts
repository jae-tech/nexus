/**
 * 직원 관리 비즈니스 로직
 *
 * 직원 CRUD, 스케줄 관리, 성과 분석 등
 */

import type { BeautyDatabase, Staff } from "./database";

/**
 * 직원 성과 통계
 */
export interface StaffPerformance {
  staff_id: number;
  staff_name: string;
  position: string;
  total_reservations: number;
  completed_reservations: number;
  cancelled_reservations: number;
  total_revenue: number;
  avg_revenue_per_reservation: number;
  completion_rate: number; // 완료율
  performance_score: number;
}

/**
 * 직원 스케줄
 */
export interface StaffSchedule {
  staff_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_working: boolean;
  break_start?: string;
  break_end?: string;
  notes?: string;
}

/**
 * 직원 휴가/휴무
 */
export interface StaffLeave {
  id?: number;
  staff_id: number;
  start_date: string;
  end_date: string;
  leave_type: "vacation" | "sick" | "personal" | "unpaid";
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

/**
 * 직원 삭제 영향 분석
 */
export interface StaffDeletionImpact {
  canDelete: boolean;
  activeReservations: number;
  futureReservations: number;
  completedReservations: number;
  warnings: string[];
  reassignmentNeeded: boolean;
}

/**
 * 직원 관리 비즈니스 로직
 */
export class StaffLogic {
  private db: BeautyDatabase;

  constructor(db: BeautyDatabase) {
    this.db = db;
  }

  /**
   * 직책별 직원 그룹핑
   */
  public getStaffByPosition(): Map<string, Staff[]> {
    try {
      const staff = this.db.getAllStaff();
      const grouped = new Map<string, Staff[]>();

      for (const member of staff) {
        const position = member.position || "미지정";
        if (!grouped.has(position)) {
          grouped.set(position, []);
        }
        grouped.get(position)!.push(member);
      }

      return grouped;
    } catch (error) {
      console.error("[StaffLogic] Error grouping staff by position:", error);
      throw error;
    }
  }

  /**
   * 직원 성과 분석
   */
  public analyzeStaffPerformance(staffId?: number, startDate?: string, endDate?: string): StaffPerformance[] {
    try {
      const performanceData = this.db.getStaffPerformance(startDate, endDate);

      // 특정 직원만 조회
      const filteredData = staffId
        ? performanceData.filter((p) => p.id === staffId)
        : performanceData;

      return filteredData.map((data) => {
        const totalReservations = data.total_reservations || 0;
        const completedReservations = data.completed_count || 0;
        const totalRevenue = data.total_revenue || 0;

        // 완료율 계산
        const completionRate = totalReservations > 0 ? (completedReservations / totalReservations) * 100 : 0;

        // 평균 예약당 매출
        const avgRevenue = completedReservations > 0 ? totalRevenue / completedReservations : 0;

        // 성과 점수 (완료율 + 매출 기여도)
        const performanceScore = completionRate * 0.5 + (totalRevenue / 1000000) * 0.5;

        return {
          staff_id: data.id,
          staff_name: data.name,
          position: data.position,
          total_reservations: totalReservations,
          completed_reservations: completedReservations,
          cancelled_reservations: totalReservations - completedReservations,
          total_revenue: totalRevenue,
          avg_revenue_per_reservation: avgRevenue,
          completion_rate: completionRate,
          performance_score: performanceScore,
        };
      });
    } catch (error) {
      console.error("[StaffLogic] Error analyzing staff performance:", error);
      throw error;
    }
  }

  /**
   * 직원별 예약 현황
   */
  public getStaffReservationStatus(staffId: number, startDate?: string, endDate?: string): {
    upcoming: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  } {
    try {
      const schedule = this.db.getStaffSchedule(staffId, startDate, endDate);

      const today = new Date().toISOString().split("T")[0];

      return {
        upcoming: schedule.filter(
          (r) => r.reservation_date > today && (r.status === "pending" || r.status === "confirmed")
        ).length,
        inProgress: schedule.filter(
          (r) => r.reservation_date === today && r.status === "confirmed"
        ).length,
        completed: schedule.filter((r) => r.status === "completed").length,
        cancelled: schedule.filter((r) => r.status === "cancelled").length,
      };
    } catch (error) {
      console.error("[StaffLogic] Error getting staff reservation status:", error);
      throw error;
    }
  }

  /**
   * 직원 삭제 영향 분석
   */
  public analyzeStaffDeletion(staffId: number): StaffDeletionImpact {
    try {
      const staff = this.db.getStaffById(staffId);
      if (!staff) {
        return {
          canDelete: false,
          activeReservations: 0,
          futureReservations: 0,
          completedReservations: 0,
          warnings: ["직원을 찾을 수 없습니다."],
          reassignmentNeeded: false,
        };
      }

      // 직원의 예약 조회
      const today = new Date().toISOString().split("T")[0];
      const schedule = this.db.getStaffSchedule(staffId);

      const activeReservations = schedule.filter(
        (r) => r.status === "pending" || r.status === "confirmed"
      ).length;

      const futureReservations = schedule.filter(
        (r) => r.reservation_date >= today && r.status !== "cancelled"
      ).length;

      const completedReservations = schedule.filter((r) => r.status === "completed").length;

      const warnings: string[] = [];

      if (activeReservations > 0) {
        warnings.push(`${activeReservations}건의 활성 예약이 있습니다.`);
      }

      if (futureReservations > 0) {
        warnings.push(`${futureReservations}건의 미래 예약이 있습니다. 다른 직원에게 재배정이 필요합니다.`);
      }

      if (completedReservations > 0) {
        warnings.push(`${completedReservations}건의 완료된 예약 이력이 있습니다.`);
      }

      return {
        canDelete: activeReservations === 0 && futureReservations === 0,
        activeReservations,
        futureReservations,
        completedReservations,
        warnings,
        reassignmentNeeded: futureReservations > 0,
      };
    } catch (error) {
      console.error("[StaffLogic] Error analyzing staff deletion:", error);
      throw error;
    }
  }

  /**
   * 예약 재배정 (직원 퇴사 시)
   */
  public reassignReservations(fromStaffId: number, toStaffId: number, startDate?: string): number {
    try {
      const fromStaff = this.db.getStaffById(fromStaffId);
      const toStaff = this.db.getStaffById(toStaffId);

      if (!fromStaff || !toStaff) {
        throw new Error("직원을 찾을 수 없습니다.");
      }

      // 재배정할 예약 조회
      const today = new Date().toISOString().split("T")[0];
      const dateToCheck = startDate || today;

      const schedule = this.db.getStaffSchedule(fromStaffId, dateToCheck);
      const toReassign = schedule.filter(
        (r) => r.reservation_date >= dateToCheck && r.status !== "cancelled" && r.status !== "completed"
      );

      // 예약 재배정
      let reassignedCount = 0;
      for (const reservation of toReassign) {
        try {
          this.db.updateReservation(reservation.id, {
            staff_id: toStaffId,
          });
          reassignedCount++;
        } catch (error) {
          console.error(`[StaffLogic] Error reassigning reservation ${reservation.id}:`, error);
        }
      }

      return reassignedCount;
    } catch (error) {
      console.error("[StaffLogic] Error reassigning reservations:", error);
      throw error;
    }
  }

  /**
   * 직원별 근무시간 통계
   */
  public getStaffWorkingHours(staffId: number, startDate: string, endDate: string): {
    totalDays: number;
    totalReservations: number;
    avgReservationsPerDay: number;
    busiestDay: string;
  } {
    try {
      const schedule = this.db.getStaffSchedule(staffId, startDate, endDate);

      // 날짜별 예약 수 계산
      const dailyReservations = new Map<string, number>();
      for (const reservation of schedule) {
        const date = reservation.reservation_date;
        dailyReservations.set(date, (dailyReservations.get(date) || 0) + 1);
      }

      // 가장 바쁜 날 찾기
      let busiestDay = "";
      let maxReservations = 0;
      for (const [date, count] of dailyReservations) {
        if (count > maxReservations) {
          maxReservations = count;
          busiestDay = date;
        }
      }

      return {
        totalDays: dailyReservations.size,
        totalReservations: schedule.length,
        avgReservationsPerDay: dailyReservations.size > 0 ? schedule.length / dailyReservations.size : 0,
        busiestDay,
      };
    } catch (error) {
      console.error("[StaffLogic] Error calculating working hours:", error);
      throw error;
    }
  }

  /**
   * TOP 직원 조회 (성과 기준)
   */
  public getTopPerformers(limit: number = 5, startDate?: string, endDate?: string): StaffPerformance[] {
    try {
      const performance = this.analyzeStaffPerformance(undefined, startDate, endDate);
      return performance.sort((a, b) => b.performance_score - a.performance_score).slice(0, limit);
    } catch (error) {
      console.error("[StaffLogic] Error getting top performers:", error);
      throw error;
    }
  }

  /**
   * 직원 검증
   */
  public validateStaff(staff: Omit<Staff, "id">): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 이름 검증
    if (!staff.name || staff.name.trim().length === 0) {
      errors.push("직원 이름은 필수입니다.");
    }

    // 전화번호 검증
    if (!staff.phone || staff.phone.trim().length === 0) {
      errors.push("전화번호는 필수입니다.");
    }

    // 전화번호 형식 검증 (간단)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (staff.phone && !phoneRegex.test(staff.phone)) {
      errors.push("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
    }

    // 직책 검증
    if (!staff.position || staff.position.trim().length === 0) {
      errors.push("직책은 필수입니다.");
    }

    // 급여 검증
    if (staff.salary && staff.salary < 0) {
      errors.push("급여는 0 이상이어야 합니다.");
    }

    // 전화번호 중복 검증
    const existing = this.db.getAllStaff();
    if (existing.some((s) => s.phone === staff.phone)) {
      errors.push("이미 등록된 전화번호입니다.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 직원 수정 검증
   */
  public validateStaffUpdate(staffId: number, updates: Partial<Staff>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 직원 존재 확인
    const staff = this.db.getStaffById(staffId);
    if (!staff) {
      errors.push("존재하지 않는 직원입니다.");
      return { valid: false, errors };
    }

    // 전화번호 중복 검증
    if (updates.phone) {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(updates.phone)) {
        errors.push("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
      }

      const existing = this.db.getAllStaff();
      if (existing.some((s) => s.id !== staffId && s.phone === updates.phone)) {
        errors.push("이미 등록된 전화번호입니다.");
      }
    }

    // 급여 검증
    if (updates.salary !== undefined && updates.salary < 0) {
      errors.push("급여는 0 이상이어야 합니다.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 직원 검색
   */
  public searchStaff(options: {
    query?: string;
    position?: string;
    sortBy?: "name" | "position" | "hire_date";
    sortOrder?: "asc" | "desc";
  }): Staff[] {
    try {
      let staff = this.db.getAllStaff();

      // 직책 필터
      if (options.position) {
        staff = staff.filter((s) => s.position === options.position);
      }

      // 검색어 필터
      if (options.query) {
        const query = options.query.toLowerCase();
        staff = staff.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.phone.includes(query) ||
            s.position.toLowerCase().includes(query)
        );
      }

      // 정렬
      if (options.sortBy === "name") {
        staff.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sortBy === "position") {
        staff.sort((a, b) => a.position.localeCompare(b.position));
      } else if (options.sortBy === "hire_date") {
        staff.sort((a, b) => (a.hire_date || "").localeCompare(b.hire_date || ""));
      }

      if (options.sortOrder === "desc") {
        staff.reverse();
      }

      return staff;
    } catch (error) {
      console.error("[StaffLogic] Error searching staff:", error);
      throw error;
    }
  }
}
