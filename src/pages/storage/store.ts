import { create } from 'zustand'
import type { StorageState } from './interface'
import { postStorage } from './api'

export const useStorageStore = create<StorageState>((set) => ({
  isActionLoading: false,
  isActionSuccess: false,
  isError: false,
  isLoading: false,
  files: [],

  uploadFiles: async (path: string, file: FormData) => {
    set({ isActionLoading: true, isActionSuccess: false, isError: false })
    try {
      const res = await postStorage(path, file)
      if (res.status === 201 && res.data) {
        set((state) => ({
          isActionSuccess: true,
          files: state.files.concat(res.data || []),
        }))
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isActionLoading: false })
    }
  },

  resetFiles: () => {
    set({
      isActionLoading: false,
      isActionSuccess: false,
      isError: false,
      isLoading: false,
      files: [],
    })
  },
}))
