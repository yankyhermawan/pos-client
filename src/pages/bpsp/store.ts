import { create } from 'zustand'
import {
  type BpspCreateForm,
  type BpspForm,
  type GetBpspParams,
  type BpspState,
  bpspDetailSchema,
  bpspListingSchema,
} from './interface'
import * as action from './action'

export const useBpspParam = create<BpspState>((set) => ({
  bpsp: undefined,
  bpsps: [],
  count: 0,
  isActionLoading: false,
  isActionSuccess: false,
  isError: false,
  isLoading: false,

  getBpsp: async (id: number) => {
    set({ isLoading: true, isError: false })
    try {
      const res = await action.getBpsp(id)
      if (res.status === 200) {
        set({ bpsp: bpspDetailSchema.parse(res.data) })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  getBpsps: async (params: GetBpspParams) => {
    set({ isLoading: true, isError: false })
    try {
      const res = await action.getBpsps(params)
      if (res.status === 200 && res.data) {
        set({
          count: res.data.count || 0,
          bpsps: (res.data.data ?? []).map((dt) => bpspListingSchema.parse(dt)),
        })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },

  createBpsp: async (body: BpspCreateForm) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.createBpsp(body)
      if (res.status === 200 || res.status === 201) {
        set({ isActionSuccess: true })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isActionLoading: false })
    }
  },

  updateBpsp: async (body: BpspForm) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.updateBpsp(body)
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
      bpsp: undefined,
      isActionLoading: false,
      isActionSuccess: false,
      isError: false,
    })
  },
}))
