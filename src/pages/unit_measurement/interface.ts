import z from 'zod'
import type { DefaultStoreInterface } from '../utility/global_interface'

export const unitMeasurementSchema = z.object({
  id: z.number(),
  value: z.string(),
})

export type UnitMeasurement = z.infer<typeof unitMeasurementSchema>

export type UnitMeasurementState = DefaultStoreInterface & {
  unitMeasurements: UnitMeasurement[]

  getUnitMeasurements: () => void
}
