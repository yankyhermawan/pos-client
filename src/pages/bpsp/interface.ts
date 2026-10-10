import z from 'zod'
import type {
  ActionStoreInterface,
  DefaultPaginationQuery,
} from '../utility/global_interface'
import { unitMeasurementSchema } from '../unit_measurement/interface'

export type GetBpspParams = DefaultPaginationQuery & {
  name?: string
  id?: number
}

export const bpspFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1),
  unit_measurement_id: z.number().positive(),
})

export const bpspDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  store_id: z.number(),
  unit_measurement_id: z.number(),
})

export const bpspListingSchema = z.object({
  id: z.number(),
  name: z.string(),
  store_id: z.number(),
  unit_measurement_id: z.number(),
  unit_measurement: unitMeasurementSchema,
})

export type BpspForm = z.infer<typeof bpspFormSchema>
export type BpspCreateForm = Omit<BpspForm, 'id'>
export type BpspDetail = z.infer<typeof bpspDetailSchema>
export type BpspListing = z.infer<typeof bpspListingSchema>

export type BpspState = ActionStoreInterface & {
  bpsp: BpspDetail | undefined
  bpsps: BpspListing[]
  count: number

  getBpsp: (id: number) => void
  getBpsps: (params: GetBpspParams) => void
  createBpsp: (body: BpspCreateForm) => void
  updateBpsp: (body: BpspForm) => void

  reset: () => void
}
