import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Customer } from '@/types'

interface CustomerState {
  customers: Customer[]
  selectedCustomer: Customer | null
  searchQuery: string
  filterType: 'all' | 'recent' | 'regular' | 'new'
  sortBy: 'name' | 'lastVisit' | 'visitCount' | 'registered'
  isLoading: boolean
  error: string | null

  // Actions
  setCustomers: (customers: Customer[]) => void
  addCustomer: (customer: Customer) => void
  updateCustomer: (id: number, updates: Partial<Customer>) => void
  deleteCustomer: (id: number) => void
  setSelectedCustomer: (customer: Customer | null) => void
  setSearchQuery: (query: string) => void
  setFilterType: (type: 'all' | 'recent' | 'regular' | 'new') => void
  setSortBy: (sort: 'name' | 'lastVisit' | 'visitCount' | 'registered') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Computed
  getFilteredCustomers: () => Customer[]
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: [],
      selectedCustomer: null,
      searchQuery: '',
      filterType: 'all',
      sortBy: 'name',
      isLoading: false,
      error: null,

      setCustomers: (customers) => set({ customers }),

      addCustomer: (customer) =>
        set((state) => ({
          customers: [...state.customers, customer]
        })),

      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id ? { ...customer, ...updates } : customer
          )
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id)
        })),

      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getFilteredCustomers: () => {
        const { customers, searchQuery, filterType, sortBy } = get()

        let filtered = customers.filter((customer) => {
          const matchesSearch =
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery)

          if (!matchesSearch) return false

          const today = new Date()
          const lastVisitDate = customer.lastVisit ? new Date(customer.lastVisit) : null
          const registeredDate = new Date(customer.registeredDate)

          switch (filterType) {
            case 'recent':
              if (!lastVisitDate) return false
              const daysSinceVisit = Math.floor(
                (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
              )
              return daysSinceVisit <= 30
            case 'regular':
              return customer.totalVisits >= 5
            case 'new':
              const daysSinceRegistered = Math.floor(
                (today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
              )
              return daysSinceRegistered <= 30
            default:
              return true
          }
        })

        // 정렬
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'name':
              return a.name.localeCompare(b.name)
            case 'lastVisit':
              if (!a.lastVisit && !b.lastVisit) return 0
              if (!a.lastVisit) return 1
              if (!b.lastVisit) return -1
              return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
            case 'visitCount':
              return b.totalVisits - a.totalVisits
            case 'registered':
              return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime()
            default:
              return 0
          }
        })

        return filtered
      }
    }),
    {
      name: 'customer-storage',
      partialize: (state) => ({
        customers: state.customers,
        searchQuery: state.searchQuery,
        filterType: state.filterType,
        sortBy: state.sortBy
      })
    }
  )
)