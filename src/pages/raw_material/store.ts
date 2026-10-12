import { create } from 'zustand'
import {
  type GetRawMaterialParams,
  type RawMaterialCreateForm,
  type RawMaterialForm,
  type RawMaterialState,
  rawMaterialDetailSchema,
  rawMaterialListingSchema,
} from './interface'
import * as action from './action'

export const useRawMaterialStore = create<RawMaterialState>((set) => ({
  count: 0,
  isActionLoading: false,
  isActionSuccess: false,
  isError: false,
  isLoading: false,
  rawMaterial: undefined,
  rawMaterials: [],

  getRawMaterial: async (id: number) => {
    set({ isLoading: true, isError: false })
    try {
      const res = await action.getRawMaterial(id)
      if (res.status === 200) {
        set({ rawMaterial: rawMaterialDetailSchema.parse(res.data) })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  getRawMaterials: async (params: GetRawMaterialParams) => {
    set({ isLoading: true, isError: false })
    try {
      const res = await action.getRawMaterials(params)
      if (res.status === 200 && res.data) {
        set({
          count: res.data.count || 0,
          rawMaterials: (res.data.data ?? []).map((dt) =>
            rawMaterialListingSchema.parse(dt),
          ),
        })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  createRawMaterial: async (body: RawMaterialCreateForm) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.createRawMaterial(body)
      if (res.status === 200 || res.status === 201) {
        set({ isActionSuccess: true })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isActionLoading: false })
    }
  },

  updateRawMaterial: async (body: RawMaterialForm) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.updateRawMaterial(body)
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
      rawMaterial: undefined,
    })
  },
}))
