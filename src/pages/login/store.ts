import { create } from 'zustand'
import type { LoginStore, LoginFormType } from './interface'
import * as action from './action'

export const useLoginStore = create<LoginStore>((set) => ({
  data: undefined,
  isActionLoading: false,
  isActionSuccess: false,
  isError: false,
  isLoading: false,

  login: async (body: LoginFormType) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await action.login(body)
      if (res.status === 200 && res.data && res.data.token) {
        set({ data: res.data, isActionSuccess: true })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isActionLoading: false })
    }
  },
}))
