import { create } from 'zustand'
import { type GetProductParams, type ProductState } from './interface'
import * as action from './action'

export const useProductStore = create<ProductState>((set) => ({
  count: 0,
  isActionLoading: false,
  isActionSuccess: false,
  isError: false,
  isLoading: false,
  product: undefined,
  products: [],

  getProducts: async (params: GetProductParams) => {
    set({ isLoading: true, isError: false })
    try {
      const res = await action.getProducts(params)
      if (res.status === 200) {
        set({ count: res.data?.count || 0, products: res.data?.data || [] })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
}))
