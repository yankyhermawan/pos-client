import z from 'zod'
import type {
  ActionStoreInterface,
  DefaultPaginationQuery,
} from '../utility/global_interface'
import { unitMeasurementSchema } from '../unit_measurement/interface'

export type GetRawMaterialParams = DefaultPaginationQuery & {
  name?: string
  id?: number
}

export const rawMaterialFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1),
  unit_measurement_id: z.number().positive(),
})

export const rawMaterialDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  store_id: z.number(),
  unit_measurement_id: z.number(),
})

export const rawMaterialListingSchema = z.object({
  id: z.number(),
  name: z.string(),
  store_id: z.number(),
  unit_measurement_id: z.number(),
  unit_measurement: unitMeasurementSchema,
})

export type RawMaterialForm = z.infer<typeof rawMaterialFormSchema>
export type RawMaterialCreateForm = Omit<RawMaterialForm, 'id'>
export type RawMaterialDetail = z.infer<typeof rawMaterialDetailSchema>
export type RawMaterialListing = z.infer<typeof rawMaterialListingSchema>

export type RawMaterialState = ActionStoreInterface & {
  rawMaterial: RawMaterialDetail | undefined
  rawMaterials: RawMaterialListing[]
  count: number

  getRawMaterial: (id: number) => void
  getRawMaterials: (params: GetRawMaterialParams) => void
  createRawMaterial: (body: RawMaterialCreateForm) => void
  updateRawMaterial: (body: RawMaterialForm) => void

  reset: () => void
}
