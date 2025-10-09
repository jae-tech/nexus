/**
 * 예약 비즈니스 로직
 *
 * 예약 시간 충돌 검사, 영업시간 검증, 가능한 시간대 조회 등
 * 비즈니스 규칙을 구현합니다.
 */

import type { BeautyDatabase, Reservation, Service, Staff } from "./database";

/**
 * 영업시간 설정
 */
export interface BusinessHours {
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
  breakStart?: string; // "12:00"
  breakEnd?: string; // "13:00"
}

/**
 * 시간 충돌 체크 결과
 */
export interface ConflictCheck {
  hasConflict: boolean;
  conflictingReservations: Array<{
    id: number;
    customerName: string;
    startTime: string;
    endTime: string;
  }>;
}

/**
 * 가능한 시간대
 */
export interface AvailableTimeSlot {
  time: string;
  available: boolean;
  reason?: string; // "영업시간 외" | "점심시간" | "이미 예약됨"
}

/**
 * 예약 비즈니스 로직 클래스
 */
export class ReservationLogic {
  private db: BeautyDatabase;
  private businessHours: BusinessHours = {
    openTime: "09:00",
    closeTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  };

  constructor(db: BeautyDatabase, businessHours?: BusinessHours) {
    this.db = db;
    if (businessHours) {
      this.businessHours = businessHours;
    }
  }

  /**
   * 시간 문자열을 분 단위로 변환
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  /**
   * 분을 시간 문자열로 변환
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }

  /**
   * 종료 시간 계산 (시작 시간 + 소요 시간)
   */
  public calculateEndTime(startTime: string, durationMinutes: number): string {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = startMinutes + durationMinutes;
    return this.minutesToTime(endMinutes);
  }

  /**
   * 영업시간 체크
   */
  public isWithinBusinessHours(startTime: string, endTime: string): boolean {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    const openMinutes = this.timeToMinutes(this.businessHours.openTime);
    const closeMinutes = this.timeToMinutes(this.businessHours.closeTime);

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      return false;
    }

    // 점심시간 체크
    if (this.businessHours.breakStart && this.businessHours.breakEnd) {
      const breakStartMinutes = this.timeToMinutes(this.businessHours.breakStart);
      const breakEndMinutes = this.timeToMinutes(this.businessHours.breakEnd);

      // 예약 시간이 점심시간과 겹치는지 확인
      if (
        (startMinutes < breakEndMinutes && endMinutes > breakStartMinutes) ||
        (startMinutes >= breakStartMinutes && startMinutes < breakEndMinutes)
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * 예약 시간 충돌 검사
   */
  public checkTimeConflict(
    date: string,
    startTime: string,
    endTime: string,
    staffId?: number,
    excludeReservationId?: number
  ): ConflictCheck {
    try {
      // 해당 날짜의 모든 예약 조회
      let reservations = this.db.getReservationsByDate(date);

      // 특정 직원만 체크
      if (staffId) {
        reservations = reservations.filter((r) => r.staff_id === staffId);
      }

      // 취소된 예약은 제외
      reservations = reservations.filter((r) => r.status !== "cancelled");

      // 수정 시 자기 자신 제외
      if (excludeReservationId) {
        reservations = reservations.filter((r) => r.id !== excludeReservationId);
      }

      const startMinutes = this.timeToMinutes(startTime);
      const endMinutes = this.timeToMinutes(endTime);

      const conflicts = reservations.filter((reservation) => {
        const resStartMinutes = this.timeToMinutes(reservation.start_time);
        const resEndMinutes = reservation.end_time ? this.timeToMinutes(reservation.end_time) : resStartMinutes + 60;

        // 시간 겹침 체크
        return startMinutes < resEndMinutes && endMinutes > resStartMinutes;
      });

      return {
        hasConflict: conflicts.length > 0,
        conflictingReservations: conflicts.map((r) => ({
          id: r.id!,
          customerName: r.customer_name,
          startTime: r.start_time,
          endTime: r.end_time || "",
        })),
      };
    } catch (error) {
      console.error("[ReservationLogic] Error checking time conflict:", error);
      throw error;
    }
  }

  /**
   * 특정 날짜/직원의 가능한 시간대 조회
   */
  public getAvailableTimeSlots(date: string, staffId?: number, serviceDuration: number = 60): AvailableTimeSlot[] {
    try {
      const slots: AvailableTimeSlot[] = [];
      const openMinutes = this.timeToMinutes(this.businessHours.openTime);
      const closeMinutes = this.timeToMinutes(this.businessHours.closeTime);

      // 30분 간격으로 시간대 생성
      for (let minutes = openMinutes; minutes < closeMinutes; minutes += 30) {
        const time = this.minutesToTime(minutes);
        const endTime = this.calculateEndTime(time, serviceDuration);

        // 영업시간 체크
        const withinHours = this.isWithinBusinessHours(time, endTime);
        if (!withinHours) {
          slots.push({
            time,
            available: false,
            reason: "영업시간 외",
          });
          continue;
        }

        // 충돌 체크
        const conflict = this.checkTimeConflict(date, time, endTime, staffId);
        if (conflict.hasConflict) {
          slots.push({
            time,
            available: false,
            reason: "이미 예약됨",
          });
          continue;
        }

        slots.push({
          time,
          available: true,
        });
      }

      return slots;
    } catch (error) {
      console.error("[ReservationLogic] Error getting available time slots:", error);
      throw error;
    }
  }

  /**
   * 특정 시간대에 예약 가능한 직원 조회
   */
  public getAvailableStaff(date: string, startTime: string, endTime: string, position?: string): Staff[] {
    try {
      let staff = this.db.getAllStaff();

      // 직책 필터
      if (position) {
        staff = staff.filter((s) => s.position === position);
      }

      // 각 직원별로 시간 충돌 체크
      const availableStaff = staff.filter((s) => {
        const conflict = this.checkTimeConflict(date, startTime, endTime, s.id);
        return !conflict.hasConflict;
      });

      return availableStaff;
    } catch (error) {
      console.error("[ReservationLogic] Error getting available staff:", error);
      throw error;
    }
  }

  /**
   * 예약 생성 전 검증
   */
  public validateReservation(reservation: {
    reservation_date: string;
    start_time: string;
    service_id: number;
    staff_id?: number;
    end_time?: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // 1. 서비스 조회
      const service = this.db.getServiceById(reservation.service_id);
      if (!service) {
        errors.push("존재하지 않는 서비스입니다.");
        return { valid: false, errors };
      }

      // 2. 종료 시간 계산
      const endTime = reservation.end_time || this.calculateEndTime(reservation.start_time, service.duration || 60);

      // 3. 영업시간 체크
      if (!this.isWithinBusinessHours(reservation.start_time, endTime)) {
        errors.push("영업시간 외 예약입니다.");
      }

      // 4. 날짜 유효성 체크
      const reservationDate = new Date(reservation.reservation_date);
      if (isNaN(reservationDate.getTime())) {
        errors.push("유효하지 않은 날짜입니다.");
      }

      // 5. 과거 날짜 체크
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (reservationDate < today) {
        errors.push("과거 날짜로는 예약할 수 없습니다.");
      }

      // 6. 시간 충돌 체크
      const conflict = this.checkTimeConflict(reservation.reservation_date, reservation.start_time, endTime, reservation.staff_id);
      if (conflict.hasConflict) {
        errors.push(`예약 시간이 겹칩니다: ${conflict.conflictingReservations.map((r) => `${r.startTime} ${r.customerName}`).join(", ")}`);
      }

      // 7. 직원 존재 체크
      if (reservation.staff_id) {
        const staff = this.db.getStaffById(reservation.staff_id);
        if (!staff) {
          errors.push("존재하지 않는 직원입니다.");
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      console.error("[ReservationLogic] Error validating reservation:", error);
      errors.push("예약 검증 중 오류가 발생했습니다.");
      return { valid: false, errors };
    }
  }

  /**
   * 예약 수정 전 검증
   */
  public validateReservationUpdate(
    reservationId: number,
    updates: {
      reservation_date?: string;
      start_time?: string;
      service_id?: number;
      staff_id?: number;
      end_time?: string;
    }
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // 기존 예약 조회
      const existing = this.db.getReservationById(reservationId);
      if (!existing) {
        errors.push("존재하지 않는 예약입니다.");
        return { valid: false, errors };
      }

      // 병합된 예약 정보
      const merged = {
        reservation_date: updates.reservation_date || existing.reservation_date,
        start_time: updates.start_time || existing.start_time,
        service_id: updates.service_id || existing.service_id,
        staff_id: updates.staff_id !== undefined ? updates.staff_id : existing.staff_id,
        end_time: updates.end_time || existing.end_time,
      };

      // 서비스 조회 (종료 시간 계산용)
      const service = this.db.getServiceById(merged.service_id);
      if (!service) {
        errors.push("존재하지 않는 서비스입니다.");
        return { valid: false, errors };
      }

      // 종료 시간 계산
      const endTime = merged.end_time || this.calculateEndTime(merged.start_time, service.duration || 60);

      // 영업시간 체크
      if (!this.isWithinBusinessHours(merged.start_time, endTime)) {
        errors.push("영업시간 외 예약입니다.");
      }

      // 시간 충돌 체크 (자기 자신은 제외)
      const conflict = this.checkTimeConflict(merged.reservation_date, merged.start_time, endTime, merged.staff_id, reservationId);
      if (conflict.hasConflict) {
        errors.push(`예약 시간이 겹칩니다: ${conflict.conflictingReservations.map((r) => `${r.startTime} ${r.customerName}`).join(", ")}`);
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      console.error("[ReservationLogic] Error validating reservation update:", error);
      errors.push("예약 수정 검증 중 오류가 발생했습니다.");
      return { valid: false, errors };
    }
  }

  /**
   * 대안 시간 제안
   */
  public suggestAlternativeTimeSlots(
    date: string,
    staffId?: number,
    serviceDuration: number = 60,
    limit: number = 5
  ): AvailableTimeSlot[] {
    try {
      const availableSlots = this.getAvailableTimeSlots(date, staffId, serviceDuration);
      return availableSlots.filter((slot) => slot.available).slice(0, limit);
    } catch (error) {
      console.error("[ReservationLogic] Error suggesting alternative time slots:", error);
      throw error;
    }
  }

  /**
   * 휴무일 설정 (확장 가능)
   */
  public isHoliday(date: string): boolean {
    // TODO: 휴무일 데이터베이스 테이블 생성 후 구현
    // 현재는 일요일만 휴무로 처리
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0; // 일요일
  }

  /**
   * 예약 가능 여부 종합 체크
   */
  public canMakeReservation(date: string, startTime: string, endTime: string, staffId?: number): { can: boolean; reason?: string } {
    try {
      // 1. 휴무일 체크
      if (this.isHoliday(date)) {
        return { can: false, reason: "휴무일입니다." };
      }

      // 2. 영업시간 체크
      if (!this.isWithinBusinessHours(startTime, endTime)) {
        return { can: false, reason: "영업시간 외 시간입니다." };
      }

      // 3. 시간 충돌 체크
      const conflict = this.checkTimeConflict(date, startTime, endTime, staffId);
      if (conflict.hasConflict) {
        return { can: false, reason: "이미 예약된 시간입니다." };
      }

      return { can: true };
    } catch (error) {
      console.error("[ReservationLogic] Error checking reservation availability:", error);
      return { can: false, reason: "예약 가능 여부 확인 중 오류가 발생했습니다." };
    }
  }

  /**
   * 영업시간 변경
   */
  public updateBusinessHours(businessHours: BusinessHours): void {
    this.businessHours = businessHours;
  }

  /**
   * 현재 영업시간 조회
   */
  public getBusinessHours(): BusinessHours {
    return this.businessHours;
  }
}
