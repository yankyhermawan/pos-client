import z from 'zod'
import type {
  ActionStoreInterface,
  DefaultPaginationQuery,
} from '../utility/global_interface'

export type GetProductParams = DefaultPaginationQuery & {
  store_id?: number
  name?: string
  id?: number
}

export const productCompositionSchema = z.object({
  bpsp_id: z.number().nullable(),
  id: z.number(),
  raw_material_id: z.number().nullable(),
  qty: z.number().default(0),
})

export const productImageSchema = z.object({
  id: z.number(),
  image_url: z.string(),
})

export const productListingSchema = z.object({
  id: z.number(),
  name: z.string(),
  stock_qty: z.number().default(0),
  price: z.number().default(0),
  product_images: z.array(productImageSchema),
})

export const productDetailSchema = z.object({
  compositions: z.array(productCompositionSchema),
  id: z.number(),
  name: z.string(),
  stock_qty: z.number().default(0),
  store_id: z.number(),
  price: z.number().default(0),
  product_images: z.array(productImageSchema),
})

export const productFormSchema = z.object({
  compositions: z.array(productCompositionSchema.partial()).default([]),
  id: z.number().optional(),
  name: z.string(),
  stock_qty: z.number().default(0),
  store_id: z.number().optional(),
  price: z.number().default(0),
  product_images: z.array(productImageSchema.partial()).default([]),
})

export type ProductListing = z.infer<typeof productListingSchema>
export type ProductDetail = z.infer<typeof productDetailSchema>
export type ProductForm = z.infer<typeof productFormSchema>

export type ProductState = ActionStoreInterface & {
  count: number
  product: ProductDetail | undefined
  products: ProductListing[]

  createProduct: (body: ProductForm) => void
  getProduct: (isPublic: boolean) => (id: number) => void
  getProducts: (isPublic: boolean) => (params: GetProductParams) => void
  updateProduct: (body: ProductForm) => void

  reset: () => void
}
