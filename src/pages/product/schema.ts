import z from 'zod'
import { requiredString } from '../utility/form_validation'

const compositionSchema = z.object({
  bpsp_id: z.number().nullable(),
  id: z.number().optional(),
  product_id: z.number().optional(),
  qty: z.number(),
  raw_material_id: z.number().nullable(),
})

const productImageSchema = z.object({
  id: z.number().optional(),
  image_url: z.string(),
  product_id: z.number().optional(),
})

export const productSchema = z.object({
  compositions: z.array(compositionSchema),
  id: z.number().optional(),
  name: requiredString(),
  price: z.number(),
  stock_qty: z.number(),
  store_id: z.number(),
  product_images: z.array(productImageSchema),
})
