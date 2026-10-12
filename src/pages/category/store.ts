import { create } from 'zustand'
import {
  categorySchema,
  type CategoryCreateForm,
  type CategoryForm,
  type CategoryState,
} from './interface'
import * as action from './action'

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isActionLoading: false,
  isActionSuccess: false,
  isError: false,
  isLoading: false,

  getCategories: (isPublic: boolean) => async (storeId?: number) => {
    set({ isLoading: true, isError: false })
    try {
      const res =
        isPublic && storeId
          ? await action.getPublicCategories(storeId)
          : await action.getCategories()
      if (res.status === 200) {
        set({
          categories: (res.data ?? []).map((dt) => categorySchema.parse(dt)),
        })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  createCategory: async (body: CategoryCreateForm) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.createCategory(body)
      if (res.status === 200 || res.status === 201) {
        set({ isActionSuccess: true })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isActionLoading: false })
    }
  },

  updateCategory: async (body: CategoryForm) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.updateCategory(body)
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
      isActionLoading: false,
      isActionSuccess: false,
      isError: false,
    })
  },
}))
