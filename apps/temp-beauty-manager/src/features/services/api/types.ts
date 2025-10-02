export interface PriceOption {
  id: string;
  name: string;
  additionalPrice: number;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  duration: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  monthlyUsage: number;
  averageRating: number;
  totalRevenue: number;
  priceOptions?: PriceOption[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface PriceHistory {
  id: string;
  serviceId: string;
  oldPrice: number;
  newPrice: number;
  changeDate: string;
  reason: string;
  updatedBy: string;
}
