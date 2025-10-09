import Database from "better-sqlite3";
import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

// 데이터베이스 타입 정의
export interface Service {
  id?: number;
  name: string;
  category?: string;
  price: number;
  duration?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  gender?: "male" | "female" | "other";
  birth_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id?: number;
  name: string;
  phone: string;
  position: string;
  hire_date?: string;
  salary?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Reservation {
  id?: number;
  customer_id: number;
  staff_id?: number;
  service_id: number;
  reservation_date: string;
  start_time: string;
  end_time?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// 데이터베이스 클래스
export class BeautyDatabase {
  private db: Database.Database;

  constructor() {
    // userData 경로에 데이터베이스 파일 생성
    const userDataPath = app.getPath("userData");
    const dbPath = path.join(userDataPath, "beauty.db");

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    console.log(`[Database] Opening database at: ${dbPath}`);
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL"); // Write-Ahead Logging 활성화 (성능 향상)

    this.initialize();
  }

  // 데이터베이스 초기화 (테이블 생성)
  private initialize(): void {
    try {
      // Services 테이블
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT,
          price INTEGER NOT NULL,
          duration INTEGER,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Customers 테이블
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL UNIQUE,
          email TEXT,
          gender TEXT,
          birth_date TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Staff 테이블
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS staff (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          position TEXT NOT NULL,
          hire_date TEXT,
          salary INTEGER,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Reservations 테이블
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER NOT NULL,
          staff_id INTEGER,
          service_id INTEGER NOT NULL,
          reservation_date TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT,
          status TEXT DEFAULT 'pending',
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
          FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
          FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
        )
      `);

      // 성능 최적화를 위한 인덱스 생성
      this.createIndexes();

      console.log("[Database] Tables initialized successfully");
    } catch (error) {
      console.error("[Database] Initialization error:", error);
      throw error;
    }
  }

  // 성능 최적화를 위한 인덱스 생성
  private createIndexes(): void {
    try {
      // Services 인덱스
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
        CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);
        CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
      `);

      // Customers 인덱스
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
        CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
        CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
      `);

      // Staff 인덱스
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_staff_position ON staff(position);
        CREATE INDEX IF NOT EXISTS idx_staff_name ON staff(name);
      `);

      // Reservations 인덱스
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
        CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customer_id);
        CREATE INDEX IF NOT EXISTS idx_reservations_staff ON reservations(staff_id);
        CREATE INDEX IF NOT EXISTS idx_reservations_service ON reservations(service_id);
        CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
        CREATE INDEX IF NOT EXISTS idx_reservations_date_status ON reservations(reservation_date, status);
      `);

      console.log("[Database] Indexes created successfully");
    } catch (error) {
      console.error("[Database] Index creation error:", error);
      throw error;
    }
  }

  // ========== SERVICES CRUD ==========

  getAllServices(): Service[] {
    try {
      const stmt = this.db.prepare("SELECT * FROM services ORDER BY created_at DESC");
      return stmt.all() as Service[];
    } catch (error) {
      console.error("[Database] Error fetching services:", error);
      throw error;
    }
  }

  getServiceById(id: number): Service | undefined {
    try {
      const stmt = this.db.prepare("SELECT * FROM services WHERE id = ?");
      return stmt.get(id) as Service | undefined;
    } catch (error) {
      console.error("[Database] Error fetching service:", error);
      throw error;
    }
  }

  addService(service: Service): number {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO services (name, category, price, duration, description)
        VALUES (@name, @category, @price, @duration, @description)
      `);
      const result = stmt.run(service);
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error("[Database] Error adding service:", error);
      throw error;
    }
  }

  updateService(id: number, service: Partial<Service>): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE services
        SET name = COALESCE(@name, name),
            category = COALESCE(@category, category),
            price = COALESCE(@price, price),
            duration = COALESCE(@duration, duration),
            description = COALESCE(@description, description),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `);
      stmt.run({ id, ...service });
    } catch (error) {
      console.error("[Database] Error updating service:", error);
      throw error;
    }
  }

  deleteService(id: number): void {
    try {
      const stmt = this.db.prepare("DELETE FROM services WHERE id = ?");
      stmt.run(id);
    } catch (error) {
      console.error("[Database] Error deleting service:", error);
      throw error;
    }
  }

  // ========== CUSTOMERS CRUD ==========

  getAllCustomers(): Customer[] {
    try {
      const stmt = this.db.prepare("SELECT * FROM customers ORDER BY created_at DESC");
      return stmt.all() as Customer[];
    } catch (error) {
      console.error("[Database] Error fetching customers:", error);
      throw error;
    }
  }

  getCustomerById(id: number): Customer | undefined {
    try {
      const stmt = this.db.prepare("SELECT * FROM customers WHERE id = ?");
      return stmt.get(id) as Customer | undefined;
    } catch (error) {
      console.error("[Database] Error fetching customer:", error);
      throw error;
    }
  }

  addCustomer(customer: Customer): number {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO customers (name, phone, email, gender, birth_date, notes)
        VALUES (@name, @phone, @email, @gender, @birth_date, @notes)
      `);
      const result = stmt.run(customer);
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error("[Database] Error adding customer:", error);
      throw error;
    }
  }

  updateCustomer(id: number, customer: Partial<Customer>): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE customers
        SET name = COALESCE(@name, name),
            phone = COALESCE(@phone, phone),
            email = COALESCE(@email, email),
            gender = COALESCE(@gender, gender),
            birth_date = COALESCE(@birth_date, birth_date),
            notes = COALESCE(@notes, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `);
      stmt.run({ id, ...customer });
    } catch (error) {
      console.error("[Database] Error updating customer:", error);
      throw error;
    }
  }

  deleteCustomer(id: number): void {
    try {
      const stmt = this.db.prepare("DELETE FROM customers WHERE id = ?");
      stmt.run(id);
    } catch (error) {
      console.error("[Database] Error deleting customer:", error);
      throw error;
    }
  }

  // ========== STAFF CRUD ==========

  getAllStaff(): Staff[] {
    try {
      const stmt = this.db.prepare("SELECT * FROM staff ORDER BY created_at DESC");
      return stmt.all() as Staff[];
    } catch (error) {
      console.error("[Database] Error fetching staff:", error);
      throw error;
    }
  }

  getStaffById(id: number): Staff | undefined {
    try {
      const stmt = this.db.prepare("SELECT * FROM staff WHERE id = ?");
      return stmt.get(id) as Staff | undefined;
    } catch (error) {
      console.error("[Database] Error fetching staff:", error);
      throw error;
    }
  }

  addStaff(staff: Staff): number {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO staff (name, phone, position, hire_date, salary, notes)
        VALUES (@name, @phone, @position, @hire_date, @salary, @notes)
      `);
      const result = stmt.run(staff);
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error("[Database] Error adding staff:", error);
      throw error;
    }
  }

  updateStaff(id: number, staff: Partial<Staff>): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE staff
        SET name = COALESCE(@name, name),
            phone = COALESCE(@phone, phone),
            position = COALESCE(@position, position),
            hire_date = COALESCE(@hire_date, hire_date),
            salary = COALESCE(@salary, salary),
            notes = COALESCE(@notes, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `);
      stmt.run({ id, ...staff });
    } catch (error) {
      console.error("[Database] Error updating staff:", error);
      throw error;
    }
  }

  deleteStaff(id: number): void {
    try {
      const stmt = this.db.prepare("DELETE FROM staff WHERE id = ?");
      stmt.run(id);
    } catch (error) {
      console.error("[Database] Error deleting staff:", error);
      throw error;
    }
  }

  // ========== RESERVATIONS CRUD ==========

  getAllReservations(): Reservation[] {
    try {
      const stmt = this.db.prepare("SELECT * FROM reservations ORDER BY reservation_date DESC, start_time DESC");
      return stmt.all() as Reservation[];
    } catch (error) {
      console.error("[Database] Error fetching reservations:", error);
      throw error;
    }
  }

  getReservationById(id: number): Reservation | undefined {
    try {
      const stmt = this.db.prepare("SELECT * FROM reservations WHERE id = ?");
      return stmt.get(id) as Reservation | undefined;
    } catch (error) {
      console.error("[Database] Error fetching reservation:", error);
      throw error;
    }
  }

  addReservation(reservation: Reservation): number {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO reservations (customer_id, staff_id, service_id, reservation_date, start_time, end_time, status, notes)
        VALUES (@customer_id, @staff_id, @service_id, @reservation_date, @start_time, @end_time, @status, @notes)
      `);
      const result = stmt.run(reservation);
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error("[Database] Error adding reservation:", error);
      throw error;
    }
  }

  updateReservation(id: number, reservation: Partial<Reservation>): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE reservations
        SET customer_id = COALESCE(@customer_id, customer_id),
            staff_id = COALESCE(@staff_id, staff_id),
            service_id = COALESCE(@service_id, service_id),
            reservation_date = COALESCE(@reservation_date, reservation_date),
            start_time = COALESCE(@start_time, start_time),
            end_time = COALESCE(@end_time, end_time),
            status = COALESCE(@status, status),
            notes = COALESCE(@notes, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `);
      stmt.run({ id, ...reservation });
    } catch (error) {
      console.error("[Database] Error updating reservation:", error);
      throw error;
    }
  }

  deleteReservation(id: number): void {
    try {
      const stmt = this.db.prepare("DELETE FROM reservations WHERE id = ?");
      stmt.run(id);
    } catch (error) {
      console.error("[Database] Error deleting reservation:", error);
      throw error;
    }
  }

  // ========== 검색/필터 메서드 ==========

  /**
   * 고객 검색 (이름 또는 전화번호)
   */
  searchCustomers(searchTerm: string): Customer[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM customers
        WHERE name LIKE ? OR phone LIKE ?
        ORDER BY created_at DESC
      `);
      const term = `%${searchTerm}%`;
      return stmt.all(term, term) as Customer[];
    } catch (error) {
      console.error("[Database] Error searching customers:", error);
      throw error;
    }
  }

  /**
   * 고급 고객 검색 (다양한 필터와 정렬 옵션)
   */
  searchCustomersAdvanced(options: {
    query?: string;
    gender?: string;
    sortBy?: "name" | "created_at" | "birth_date";
    sortOrder?: "asc" | "desc";
    limit?: number;
  }): Customer[] {
    try {
      let query = "SELECT * FROM customers WHERE 1=1";
      const params: any[] = [];

      if (options.query) {
        query += " AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)";
        const term = `%${options.query}%`;
        params.push(term, term, term);
      }

      if (options.gender) {
        query += " AND gender = ?";
        params.push(options.gender);
      }

      // 정렬
      const sortBy = options.sortBy || "created_at";
      const sortOrder = options.sortOrder || "desc";
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

      // 제한
      if (options.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as Customer[];
    } catch (error) {
      console.error("[Database] Error in searchCustomersAdvanced:", error);
      throw error;
    }
  }

  /**
   * 서비스 검색 (이름 또는 카테고리)
   */
  searchServices(searchTerm: string, category?: string): Service[] {
    try {
      let query = `SELECT * FROM services WHERE (name LIKE ? OR category LIKE ?)`;
      const params: any[] = [`%${searchTerm}%`, `%${searchTerm}%`];

      if (category) {
        query += ` AND category = ?`;
        params.push(category);
      }

      query += ` ORDER BY created_at DESC`;

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as Service[];
    } catch (error) {
      console.error("[Database] Error searching services:", error);
      throw error;
    }
  }

  /**
   * 고급 서비스 검색 (다양한 필터와 정렬 옵션)
   */
  searchServicesAdvanced(options: {
    query?: string;
    category?: string;
    priceRange?: [number, number];
    sortBy?: "name" | "price" | "duration" | "created_at";
    sortOrder?: "asc" | "desc";
    limit?: number;
  }): Service[] {
    try {
      let query = "SELECT * FROM services WHERE 1=1";
      const params: any[] = [];

      if (options.query) {
        query += " AND (name LIKE ? OR description LIKE ?)";
        const term = `%${options.query}%`;
        params.push(term, term);
      }

      if (options.category) {
        query += " AND category = ?";
        params.push(options.category);
      }

      if (options.priceRange) {
        query += " AND price BETWEEN ? AND ?";
        params.push(options.priceRange[0], options.priceRange[1]);
      }

      // 정렬
      const sortBy = options.sortBy || "created_at";
      const sortOrder = options.sortOrder || "desc";
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

      // 제한
      if (options.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as Service[];
    } catch (error) {
      console.error("[Database] Error in searchServicesAdvanced:", error);
      throw error;
    }
  }

  /**
   * 고급 예약 검색
   */
  searchReservationsAdvanced(options: {
    customerId?: number;
    staffId?: number;
    serviceId?: number;
    status?: string;
    dateRange?: [string, string];
    sortBy?: "reservation_date" | "start_time" | "created_at";
    sortOrder?: "asc" | "desc";
    limit?: number;
  }): Reservation[] {
    try {
      let query = "SELECT * FROM reservations WHERE 1=1";
      const params: any[] = [];

      if (options.customerId) {
        query += " AND customer_id = ?";
        params.push(options.customerId);
      }

      if (options.staffId) {
        query += " AND staff_id = ?";
        params.push(options.staffId);
      }

      if (options.serviceId) {
        query += " AND service_id = ?";
        params.push(options.serviceId);
      }

      if (options.status) {
        query += " AND status = ?";
        params.push(options.status);
      }

      if (options.dateRange) {
        query += " AND reservation_date BETWEEN ? AND ?";
        params.push(options.dateRange[0], options.dateRange[1]);
      }

      // 정렬
      const sortBy = options.sortBy || "reservation_date";
      const sortOrder = options.sortOrder || "desc";
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

      // 제한
      if (options.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as Reservation[];
    } catch (error) {
      console.error("[Database] Error in searchReservationsAdvanced:", error);
      throw error;
    }
  }

  /**
   * 날짜 범위로 예약 조회
   */
  getReservationsByDateRange(startDate: string, endDate: string, status?: string): Reservation[] {
    try {
      let query = `
        SELECT * FROM reservations
        WHERE reservation_date BETWEEN ? AND ?
      `;
      const params: any[] = [startDate, endDate];

      if (status) {
        query += ` AND status = ?`;
        params.push(status);
      }

      query += ` ORDER BY reservation_date ASC, start_time ASC`;

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as Reservation[];
    } catch (error) {
      console.error("[Database] Error fetching reservations by date range:", error);
      throw error;
    }
  }

  /**
   * 가격 범위로 서비스 필터링
   */
  getServicesByPriceRange(minPrice: number, maxPrice: number): Service[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM services
        WHERE price BETWEEN ? AND ?
        ORDER BY price ASC
      `);
      return stmt.all(minPrice, maxPrice) as Service[];
    } catch (error) {
      console.error("[Database] Error fetching services by price range:", error);
      throw error;
    }
  }

  /**
   * 카테고리별 서비스 조회
   */
  getServicesByCategory(category: string): Service[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM services
        WHERE category = ?
        ORDER BY name ASC
      `);
      return stmt.all(category) as Service[];
    } catch (error) {
      console.error("[Database] Error fetching services by category:", error);
      throw error;
    }
  }

  /**
   * 직책별 직원 조회
   */
  getStaffByPosition(position: string): Staff[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM staff
        WHERE position = ?
        ORDER BY hire_date ASC
      `);
      return stmt.all(position) as Staff[];
    } catch (error) {
      console.error("[Database] Error fetching staff by position:", error);
      throw error;
    }
  }

  // ========== 관계형 조회 메서드 ==========

  /**
   * 예약 정보를 고객, 직원, 서비스 정보와 함께 조회
   */
  getReservationsWithDetails(): any[] {
    try {
      const stmt = this.db.prepare(`
        SELECT
          r.id,
          r.reservation_date,
          r.start_time,
          r.end_time,
          r.status,
          r.notes,
          r.created_at,
          c.id as customer_id,
          c.name as customer_name,
          c.phone as customer_phone,
          c.email as customer_email,
          s.id as service_id,
          s.name as service_name,
          s.category as service_category,
          s.price as service_price,
          s.duration as service_duration,
          st.id as staff_id,
          st.name as staff_name,
          st.position as staff_position
        FROM reservations r
        INNER JOIN customers c ON r.customer_id = c.id
        INNER JOIN services s ON r.service_id = s.id
        LEFT JOIN staff st ON r.staff_id = st.id
        ORDER BY r.reservation_date DESC, r.start_time DESC
      `);
      return stmt.all();
    } catch (error) {
      console.error("[Database] Error fetching reservations with details:", error);
      throw error;
    }
  }

  /**
   * 특정 날짜의 예약을 상세 정보와 함께 조회
   */
  getReservationsByDate(date: string): any[] {
    try {
      const stmt = this.db.prepare(`
        SELECT
          r.id,
          r.reservation_date,
          r.start_time,
          r.end_time,
          r.status,
          r.notes,
          c.id as customer_id,
          c.name as customer_name,
          c.phone as customer_phone,
          s.id as service_id,
          s.name as service_name,
          s.price as service_price,
          s.duration as service_duration,
          st.id as staff_id,
          st.name as staff_name
        FROM reservations r
        INNER JOIN customers c ON r.customer_id = c.id
        INNER JOIN services s ON r.service_id = s.id
        LEFT JOIN staff st ON r.staff_id = st.id
        WHERE r.reservation_date = ?
        ORDER BY r.start_time ASC
      `);
      return stmt.all(date);
    } catch (error) {
      console.error("[Database] Error fetching reservations by date:", error);
      throw error;
    }
  }

  /**
   * 특정 고객의 예약 이력 조회
   */
  getCustomerReservations(customerId: number): any[] {
    try {
      const stmt = this.db.prepare(`
        SELECT
          r.id,
          r.reservation_date,
          r.start_time,
          r.end_time,
          r.status,
          r.notes,
          s.name as service_name,
          s.price as service_price,
          s.duration as service_duration,
          st.name as staff_name
        FROM reservations r
        INNER JOIN services s ON r.service_id = s.id
        LEFT JOIN staff st ON r.staff_id = st.id
        WHERE r.customer_id = ?
        ORDER BY r.reservation_date DESC, r.start_time DESC
      `);
      return stmt.all(customerId);
    } catch (error) {
      console.error("[Database] Error fetching customer reservations:", error);
      throw error;
    }
  }

  /**
   * 특정 직원의 예약 스케줄 조회
   */
  getStaffSchedule(staffId: number, startDate?: string, endDate?: string): any[] {
    try {
      let query = `
        SELECT
          r.id,
          r.reservation_date,
          r.start_time,
          r.end_time,
          r.status,
          c.name as customer_name,
          c.phone as customer_phone,
          s.name as service_name,
          s.duration as service_duration
        FROM reservations r
        INNER JOIN customers c ON r.customer_id = c.id
        INNER JOIN services s ON r.service_id = s.id
        WHERE r.staff_id = ?
      `;

      const params: any[] = [staffId];

      if (startDate && endDate) {
        query += ` AND r.reservation_date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }

      query += ` ORDER BY r.reservation_date ASC, r.start_time ASC`;

      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error("[Database] Error fetching staff schedule:", error);
      throw error;
    }
  }

  // ========== 페이지네이션 메서드 ==========

  /**
   * 페이지네이션된 고객 목록 조회
   */
  getCustomersPaginated(page: number = 1, limit: number = 10, search?: string): any {
    try {
      const offset = (page - 1) * limit;

      // 전체 개수 조회
      let countQuery = "SELECT COUNT(*) as total FROM customers";
      const params: any[] = [];

      if (search) {
        countQuery += " WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      const countResult = this.db.prepare(countQuery).get(...params) as any;
      const total = countResult.total;

      // 데이터 조회
      let dataQuery = "SELECT * FROM customers";
      if (search) {
        dataQuery += " WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?";
      }
      dataQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?";

      const dataParams = search ? [...params, limit, offset] : [limit, offset];
      const data = this.db.prepare(dataQuery).all(...dataParams);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("[Database] Error in getCustomersPaginated:", error);
      throw error;
    }
  }

  /**
   * 페이지네이션된 서비스 목록 조회
   */
  getServicesPaginated(page: number = 1, limit: number = 10, category?: string, search?: string): any {
    try {
      const offset = (page - 1) * limit;

      // 전체 개수 조회
      let countQuery = "SELECT COUNT(*) as total FROM services WHERE 1=1";
      const params: any[] = [];

      if (category) {
        countQuery += " AND category = ?";
        params.push(category);
      }
      if (search) {
        countQuery += " AND (name LIKE ? OR description LIKE ?)";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      const countResult = this.db.prepare(countQuery).get(...params) as any;
      const total = countResult.total;

      // 데이터 조회
      let dataQuery = "SELECT * FROM services WHERE 1=1";
      if (category) {
        dataQuery += " AND category = ?";
      }
      if (search) {
        dataQuery += " AND (name LIKE ? OR description LIKE ?)";
      }
      dataQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?";

      const dataParams = [...params, limit, offset];
      const data = this.db.prepare(dataQuery).all(...dataParams);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("[Database] Error in getServicesPaginated:", error);
      throw error;
    }
  }

  /**
   * 페이지네이션된 예약 목록 조회
   */
  getReservationsPaginated(page: number = 1, limit: number = 10, filters?: { status?: string; dateRange?: [string, string] }): any {
    try {
      const offset = (page - 1) * limit;

      // 전체 개수 조회
      let countQuery = "SELECT COUNT(*) as total FROM reservations WHERE 1=1";
      const params: any[] = [];

      if (filters?.status) {
        countQuery += " AND status = ?";
        params.push(filters.status);
      }
      if (filters?.dateRange) {
        countQuery += " AND reservation_date BETWEEN ? AND ?";
        params.push(filters.dateRange[0], filters.dateRange[1]);
      }

      const countResult = this.db.prepare(countQuery).get(...params) as any;
      const total = countResult.total;

      // 데이터 조회
      let dataQuery = "SELECT * FROM reservations WHERE 1=1";
      if (filters?.status) {
        dataQuery += " AND status = ?";
      }
      if (filters?.dateRange) {
        dataQuery += " AND reservation_date BETWEEN ? AND ?";
      }
      dataQuery += " ORDER BY reservation_date DESC, start_time DESC LIMIT ? OFFSET ?";

      const dataParams = [...params, limit, offset];
      const data = this.db.prepare(dataQuery).all(...dataParams);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("[Database] Error in getReservationsPaginated:", error);
      throw error;
    }
  }

  /**
   * 페이지네이션된 직원 목록 조회
   */
  getStaffPaginated(page: number = 1, limit: number = 10, position?: string): any {
    try {
      const offset = (page - 1) * limit;

      // 전체 개수 조회
      let countQuery = "SELECT COUNT(*) as total FROM staff";
      const params: any[] = [];

      if (position) {
        countQuery += " WHERE position = ?";
        params.push(position);
      }

      const countResult = this.db.prepare(countQuery).get(...params) as any;
      const total = countResult.total;

      // 데이터 조회
      let dataQuery = "SELECT * FROM staff";
      if (position) {
        dataQuery += " WHERE position = ?";
      }
      dataQuery += " ORDER BY hire_date DESC LIMIT ? OFFSET ?";

      const dataParams = position ? [position, limit, offset] : [limit, offset];
      const data = this.db.prepare(dataQuery).all(...dataParams);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("[Database] Error in getStaffPaginated:", error);
      throw error;
    }
  }

  // ========== 통계 조회 메서드 ==========

  /**
   * 날짜 범위별 매출 통계
   */
  getSalesStats(startDate: string, endDate: string): any {
    try {
      const stmt = this.db.prepare(`
        SELECT
          COUNT(*) as total_reservations,
          SUM(CASE WHEN r.status = 'completed' THEN s.price ELSE 0 END) as total_revenue,
          SUM(CASE WHEN r.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
          SUM(CASE WHEN r.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
          SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
          AVG(CASE WHEN r.status = 'completed' THEN s.price ELSE NULL END) as avg_revenue
        FROM reservations r
        INNER JOIN services s ON r.service_id = s.id
        WHERE r.reservation_date BETWEEN ? AND ?
      `);
      return stmt.get(startDate, endDate);
    } catch (error) {
      console.error("[Database] Error fetching sales stats:", error);
      throw error;
    }
  }

  /**
   * 서비스별 매출 통계
   */
  getServiceStats(startDate?: string, endDate?: string): any[] {
    try {
      let query = `
        SELECT
          s.id,
          s.name,
          s.category,
          s.price,
          COUNT(r.id) as reservation_count,
          SUM(CASE WHEN r.status = 'completed' THEN s.price ELSE 0 END) as total_revenue,
          SUM(CASE WHEN r.status = 'completed' THEN 1 ELSE 0 END) as completed_count
        FROM services s
        LEFT JOIN reservations r ON s.id = r.service_id
      `;

      const params: any[] = [];

      if (startDate && endDate) {
        query += ` WHERE r.reservation_date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }

      query += `
        GROUP BY s.id, s.name, s.category, s.price
        ORDER BY total_revenue DESC
      `;

      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error("[Database] Error fetching service stats:", error);
      throw error;
    }
  }

  /**
   * 직원별 실적 통계
   */
  getStaffPerformance(startDate?: string, endDate?: string): any[] {
    try {
      let query = `
        SELECT
          st.id,
          st.name,
          st.position,
          COUNT(r.id) as total_reservations,
          SUM(CASE WHEN r.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
          SUM(CASE WHEN r.status = 'completed' THEN s.price ELSE 0 END) as total_revenue
        FROM staff st
        LEFT JOIN reservations r ON st.id = r.staff_id
        LEFT JOIN services s ON r.service_id = s.id
      `;

      const params: any[] = [];

      if (startDate && endDate) {
        query += ` WHERE r.reservation_date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }

      query += `
        GROUP BY st.id, st.name, st.position
        ORDER BY total_revenue DESC
      `;

      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error("[Database] Error fetching staff performance:", error);
      throw error;
    }
  }

  /**
   * 고객별 방문/매출 통계
   */
  getCustomerStats(customerId?: number): any[] {
    try {
      let query = `
        SELECT
          c.id,
          c.name,
          c.phone,
          COUNT(r.id) as visit_count,
          SUM(CASE WHEN r.status = 'completed' THEN s.price ELSE 0 END) as total_spent,
          MAX(r.reservation_date) as last_visit_date
        FROM customers c
        LEFT JOIN reservations r ON c.id = r.customer_id
        LEFT JOIN services s ON r.service_id = s.id
      `;

      const params: any[] = [];

      if (customerId) {
        query += ` WHERE c.id = ?`;
        params.push(customerId);
      }

      query += `
        GROUP BY c.id, c.name, c.phone
        ORDER BY total_spent DESC
      `;

      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error("[Database] Error fetching customer stats:", error);
      throw error;
    }
  }

  /**
   * 월별 매출 추이
   */
  getMonthlyRevenue(year: number): any[] {
    try {
      const stmt = this.db.prepare(`
        SELECT
          strftime('%m', r.reservation_date) as month,
          COUNT(*) as reservation_count,
          SUM(CASE WHEN r.status = 'completed' THEN s.price ELSE 0 END) as revenue
        FROM reservations r
        INNER JOIN services s ON r.service_id = s.id
        WHERE strftime('%Y', r.reservation_date) = ?
        GROUP BY month
        ORDER BY month ASC
      `);
      return stmt.all(year.toString());
    } catch (error) {
      console.error("[Database] Error fetching monthly revenue:", error);
      throw error;
    }
  }

  /**
   * 월별 통계 (상세)
   */
  getMonthlyStatsDetailed(year: number, month: number): any {
    try {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

      // 기본 통계
      const basicStats = this.db
        .prepare(
          `
        SELECT
          COUNT(*) as total_reservations,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_reservations,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_reservations,
          SUM(CASE WHEN status = 'completed' THEN s.price ELSE 0 END) as total_revenue
        FROM reservations r
        INNER JOIN services s ON r.service_id = s.id
        WHERE r.reservation_date BETWEEN ? AND ?
      `
        )
        .get(startDate, endDate) as any;

      // 평균 매출
      const avgRevenue = basicStats.completed_reservations > 0 ? basicStats.total_revenue / basicStats.completed_reservations : 0;

      // 고유 고객 수
      const uniqueCustomers = this.db
        .prepare(
          `
        SELECT COUNT(DISTINCT customer_id) as count
        FROM reservations
        WHERE reservation_date BETWEEN ? AND ?
      `
        )
        .get(startDate, endDate) as any;

      // 신규 고객 수 (해당 월에 처음 방문)
      const newCustomers = this.db
        .prepare(
          `
        SELECT COUNT(DISTINCT r1.customer_id) as count
        FROM reservations r1
        WHERE r1.reservation_date BETWEEN ? AND ?
        AND NOT EXISTS (
          SELECT 1 FROM reservations r2
          WHERE r2.customer_id = r1.customer_id
          AND r2.reservation_date < ?
        )
      `
        )
        .get(startDate, endDate, startDate) as any;

      // 가장 인기 있는 서비스
      const topService = this.db
        .prepare(
          `
        SELECT s.id, s.name, COUNT(r.id) as count
        FROM reservations r
        INNER JOIN services s ON r.service_id = s.id
        WHERE r.reservation_date BETWEEN ? AND ?
        AND r.status = 'completed'
        GROUP BY s.id, s.name
        ORDER BY count DESC
        LIMIT 1
      `
        )
        .get(startDate, endDate) as any;

      return {
        year,
        month,
        total_reservations: basicStats.total_reservations,
        completed_reservations: basicStats.completed_reservations,
        cancelled_reservations: basicStats.cancelled_reservations,
        total_revenue: basicStats.total_revenue,
        avg_revenue_per_reservation: avgRevenue,
        unique_customers: uniqueCustomers.count,
        new_customers: newCustomers.count,
        top_service: topService || { id: 0, name: "없음", count: 0 },
      };
    } catch (error) {
      console.error("[Database] Error fetching monthly stats:", error);
      throw error;
    }
  }

  /**
   * 인기 서비스 통계
   */
  getPopularServices(limit: number = 10, startDate?: string, endDate?: string): any[] {
    try {
      let query = `
        SELECT
          s.id,
          s.name,
          s.category,
          s.price,
          COUNT(r.id) as total_bookings,
          SUM(CASE WHEN r.status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
          SUM(CASE WHEN r.status = 'completed' THEN s.price ELSE 0 END) as total_revenue
        FROM services s
        LEFT JOIN reservations r ON s.id = r.service_id
      `;

      const params: any[] = [];

      if (startDate && endDate) {
        query += ` WHERE r.reservation_date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }

      query += `
        GROUP BY s.id, s.name, s.category, s.price
        ORDER BY total_bookings DESC
        LIMIT ?
      `;

      params.push(limit);

      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error("[Database] Error fetching popular services:", error);
      throw error;
    }
  }

  /**
   * 고객 방문 이력
   */
  getCustomerVisitHistory(customerId: number): any[] {
    try {
      const stmt = this.db.prepare(`
        SELECT
          r.reservation_date as visit_date,
          s.name as service_name,
          s.price as service_price,
          st.name as staff_name,
          r.status,
          r.notes
        FROM reservations r
        INNER JOIN services s ON r.service_id = s.id
        LEFT JOIN staff st ON r.staff_id = st.id
        WHERE r.customer_id = ?
        ORDER BY r.reservation_date DESC, r.start_time DESC
      `);

      return stmt.all(customerId);
    } catch (error) {
      console.error("[Database] Error fetching customer visit history:", error);
      throw error;
    }
  }

  /**
   * 대시보드 요약 통계
   */
  getDashboardStats(): any {
    try {
      const today = new Date().toISOString().split("T")[0];
      const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
      const thisMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0];

      return {
        totalCustomers: this.db.prepare("SELECT COUNT(*) as count FROM customers").get() as any,
        totalStaff: this.db.prepare("SELECT COUNT(*) as count FROM staff").get() as any,
        totalServices: this.db.prepare("SELECT COUNT(*) as count FROM services").get() as any,
        todayReservations: this.db
          .prepare(
            `
          SELECT COUNT(*) as count FROM reservations
          WHERE reservation_date = ?
        `
          )
          .get(today) as any,
        thisMonthRevenue: this.db
          .prepare(
            `
          SELECT SUM(s.price) as revenue
          FROM reservations r
          INNER JOIN services s ON r.service_id = s.id
          WHERE r.reservation_date BETWEEN ? AND ?
          AND r.status = 'completed'
        `
          )
          .get(thisMonthStart, thisMonthEnd) as any,
      };
    } catch (error) {
      console.error("[Database] Error fetching dashboard stats:", error);
      throw error;
    }
  }

  // ========== 유틸리티 메서드 ==========

  close(): void {
    this.db.close();
  }

  // 트랜잭션 예제
  executeTransaction(callback: (db: Database.Database) => void): void {
    const transaction = this.db.transaction(callback);
    transaction(this.db);
  }

  /**
   * 테스트 데이터 초기화 (개발/테스트용)
   * 외부 test-data 모듈 사용
   */
  initializeSampleData(): void {
    try {
      // 기존 데이터 확인
      const serviceCount = this.db.prepare("SELECT COUNT(*) as count FROM services").get() as any;
      if (serviceCount.count > 0) {
        console.log("[Database] Sample data already exists, skipping initialization");
        return;
      }

      console.log("[Database] Initializing test data using external module...");
      // test-data.ts의 initializeTestData를 main.ts에서 호출하도록 변경
      console.log("[Database] Please use initializeTestData() from test-data.ts instead");

      // 기존 간단한 샘플 데이터 (하위 호환성)
      console.log("[Database] Initializing minimal sample data...");

      // 샘플 서비스
      const sampleServices = [
        { name: "커트", category: "헤어", price: 30000, duration: 60, description: "기본 커트 서비스" },
        { name: "펌", category: "헤어", price: 80000, duration: 120, description: "디지털 펌" },
        { name: "염색", category: "헤어", price: 70000, duration: 90, description: "전체 염색" },
        { name: "네일 케어", category: "네일", price: 40000, duration: 60, description: "기본 네일 케어" },
        { name: "젤 네일", category: "네일", price: 60000, duration: 90, description: "젤 네일 아트" },
        { name: "페이셜", category: "스킨케어", price: 100000, duration: 90, description: "피부 관리" },
        { name: "왁싱", category: "스킨케어", price: 50000, duration: 45, description: "전신 왁싱" },
      ];

      for (const service of sampleServices) {
        this.addService(service);
      }

      // 샘플 직원
      const sampleStaff = [
        { name: "김미영", phone: "010-1111-2222", position: "헤어 디자이너", hire_date: "2023-01-15", salary: 3000000, notes: "10년 경력" },
        { name: "이수진", phone: "010-3333-4444", position: "네일 아티스트", hire_date: "2023-03-20", salary: 2500000, notes: "네일 전문" },
        { name: "박지혜", phone: "010-5555-6666", position: "피부 관리사", hire_date: "2023-06-10", salary: 2800000, notes: "피부 관리 자격증 보유" },
        { name: "최민서", phone: "010-7777-8888", position: "헤어 디자이너", hire_date: "2024-01-05", salary: 2700000, notes: "컬러 전문" },
      ];

      for (const staff of sampleStaff) {
        this.addStaff(staff);
      }

      // 샘플 고객
      const sampleCustomers = [
        { name: "홍길동", phone: "010-1234-5678", email: "hong@example.com", gender: "male" as const, birth_date: "1990-05-15", notes: "VIP 고객" },
        { name: "김영희", phone: "010-2345-6789", email: "kim@example.com", gender: "female" as const, birth_date: "1995-08-20", notes: "" },
        { name: "이철수", phone: "010-3456-7890", email: "lee@example.com", gender: "male" as const, birth_date: "1988-12-10", notes: "알레르기 주의" },
        { name: "박민지", phone: "010-4567-8901", email: "park@example.com", gender: "female" as const, birth_date: "1992-03-25", notes: "" },
        { name: "정수연", phone: "010-5678-9012", email: "jung@example.com", gender: "female" as const, birth_date: "1998-07-30", notes: "단골 고객" },
      ];

      for (const customer of sampleCustomers) {
        this.addCustomer(customer);
      }

      // 샘플 예약
      const today = new Date();
      const sampleReservations = [
        { customer_id: 1, staff_id: 1, service_id: 1, reservation_date: this.formatDate(today), start_time: "10:00", end_time: "11:00", status: "confirmed" as const, notes: "" },
        {
          customer_id: 2,
          staff_id: 2,
          service_id: 4,
          reservation_date: this.formatDate(today),
          start_time: "14:00",
          end_time: "15:00",
          status: "confirmed" as const,
          notes: "",
        },
        {
          customer_id: 3,
          staff_id: 1,
          service_id: 2,
          reservation_date: this.formatDate(this.addDays(today, 1)),
          start_time: "11:00",
          end_time: "13:00",
          status: "pending" as const,
          notes: "",
        },
        {
          customer_id: 4,
          staff_id: 3,
          service_id: 6,
          reservation_date: this.formatDate(this.addDays(today, 2)),
          start_time: "15:00",
          end_time: "16:30",
          status: "confirmed" as const,
          notes: "",
        },
        {
          customer_id: 5,
          staff_id: 2,
          service_id: 5,
          reservation_date: this.formatDate(this.addDays(today, -1)),
          start_time: "10:00",
          end_time: "11:30",
          status: "completed" as const,
          notes: "만족스러운 서비스",
        },
      ];

      for (const reservation of sampleReservations) {
        this.addReservation(reservation);
      }

      console.log("[Database] Sample data initialized successfully");
    } catch (error) {
      console.error("[Database] Error initializing sample data:", error);
      throw error;
    }
  }

  // 날짜 포맷 헬퍼
  private formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // 날짜 더하기 헬퍼
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

// 싱글톤 인스턴스
let dbInstance: BeautyDatabase | null = null;

export function getDatabase(): BeautyDatabase {
  if (!dbInstance) {
    dbInstance = new BeautyDatabase();
  }
  return dbInstance;
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
