import { create } from 'zustand'
import { unitMeasurementSchema, type UnitMeasurementState } from './interface'
import * as action from './action'

export const useUnitMeasurementStore = create<UnitMeasurementState>((set) => ({
  isError: false,
  isLoading: false,
  unitMeasurements: [],

  getUnitMeasurements: async () => {
    set({ isLoading: true, isError: false })
    try {
      const res = await action.getUnitMeasurements()
      if (res.status === 200 && res.data) {
        set({
          unitMeasurements: res.data.map((dt) =>
            unitMeasurementSchema.parse(dt),
          ),
        })
      }
    } catch {
      set({ isError: true })
    } finally {
      set({ isLoading: false })
    }
  },
}))
