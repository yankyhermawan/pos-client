import { create } from 'zustand'
import { type GetBpspParams, type BpspState } from './interface'
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
        set({ bpsp: res.data })
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
      if (res.status === 200) {
        set({ count: res.data?.count || 0, bpsps: res.data?.data || [] })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
}))
