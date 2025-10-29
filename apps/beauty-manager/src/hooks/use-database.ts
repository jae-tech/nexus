/**
 * 데이터베이스 엔티티 관리 커스텀 훅
 *
 * 고객, 직원, 서비스 데이터를 관리합니다.
 */

import { useState, useEffect, useCallback } from "react";
import type { Customer, Staff, Service } from "@/lib/api-types";

/**
 * 고객 목록 조회 훅
 */
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.db.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("[useCustomers] Error fetching customers:", err);
      setError(err instanceof Error ? err.message : "고객 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
  };
}

/**
 * 직원 목록 조회 훅
 */
export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.db.getStaff();
      setStaff(data);
    } catch (err) {
      console.error("[useStaff] Error fetching staff:", err);
      setError(err instanceof Error ? err.message : "직원 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    refetch: fetchStaff,
  };
}

/**
 * 서비스 목록 조회 훅
 */
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.db.getServices();
      setServices(data);
    } catch (err) {
      console.error("[useServices] Error fetching services:", err);
      setError(err instanceof Error ? err.message : "서비스 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}

/**
 * 특정 고객 조회 훅
 */
export function useCustomer(id: number | null) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await window.api.db.getCustomerById(id);
      setCustomer(data || null);
    } catch (err) {
      console.error("[useCustomer] Error fetching customer:", err);
      setError(err instanceof Error ? err.message : "고객 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return {
    customer,
    loading,
    error,
    refetch: fetchCustomer,
  };
}

/**
 * Electron 환경 여부 확인 훅
 */
export function useIsElectron() {
  return typeof window !== "undefined" && window.api !== undefined;
}

