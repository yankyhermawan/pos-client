import { create } from 'zustand'
import {
  type GetProductParams,
  type Product,
  type ProductState,
} from './interface'
import * as action from './action'

export const useProductStore = create<ProductState>((set) => ({
  count: 0,
  isActionLoading: false,
  isActionSuccess: false,
  isError: false,
  isLoading: false,
  product: undefined,
  products: [],

  getProduct: (isPublic: boolean) => async (id: number) => {
    set({ isLoading: true, isError: false })
    try {
      const res = isPublic
        ? await action.getPublicProduct(id)
        : await action.getProduct(id)
      if (res.status === 200) {
        set({ product: res.data })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  getProducts: (isPublic: boolean) => async (params: GetProductParams) => {
    set({ isLoading: true, isError: false })
    try {
      const res = isPublic
        ? await action.getPublicProducts(params)
        : await action.getProducts(params)
      if (res.status === 200) {
        set({ count: res.data?.count || 0, products: res.data?.data || [] })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  updateProduct: async (body: Product) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.updateProduct(body)
      if (res.status === 200) {
        set({ isActionSuccess: true })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isActionLoading: false })
    }
  },

  reset: () => {
    set({
      count: 0,
      isActionLoading: false,
      isActionSuccess: false,
      isError: false,
      isLoading: false,
      product: undefined,
      products: [],
    })
  },
}))
