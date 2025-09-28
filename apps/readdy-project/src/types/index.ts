// Beauty salon management types
export interface Customer {
  id: number
  name: string
  phone: string
  email?: string
  birthday?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  notes?: string
  registeredDate: string
  lastVisit?: string
  totalVisits: number
  totalSpent: number
  preferredServices: string[]
  skinType?: string
  allergies?: string[]
  isVip: boolean
}

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  position: string
  specialties: string[]
  status: 'active' | 'inactive'
  hireDate: string
  workingDays: string[]
  workingHours: {
    start: string
    end: string
  }
  salary?: number
  commissionRate?: number
}

export interface Service {
  id: string
  name: string
  categoryId: string
  categoryName: string
  description: string
  duration: number
  basePrice: number
  isActive: boolean
  requiredStaff?: string[]
  equipment?: string[]
  priceOptions?: {
    name: string
    price: number
    duration?: number
  }[]
}

export interface Reservation {
  id: string
  customerId: number
  customerName: string
  employeeId: string
  employeeName: string
  serviceId: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  duration: number
  price: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
  updatedAt: string
}