import { create } from 'zustand'
import type { AuthStore } from './interface'
import * as action from './action'

export const useAuthStore = create<AuthStore>((set) => ({
  data: undefined,
  isError: false,
  isLoading: false,

  getMe: async () => {
    set({ isLoading: true, isError: false })
    try {
      const res = await action.getMe()

      if (res.data) {
        set({ data: res.data })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: true })
    }
  },
}))
