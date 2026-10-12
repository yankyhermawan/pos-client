import z from 'zod'
import { categorySchema } from '../category/interface'
import type {
  ActionStoreInterface,
  DefaultPaginationQuery,
} from '../utility/global_interface'

export type GetProductParams = DefaultPaginationQuery & {
  category_id?: number
  store_id?: number
  name?: string
  id?: number
}

const arrayOrEmpty = <T extends z.ZodType>(schema: T) =>
  z
    .array(schema)
    .nullish()
    .transform((val) => val ?? [])

export const productCompositionSchema = z.object({
  bpsp_id: z.number().nullable(),
  id: z.number(),
  raw_material_id: z.number().nullable(),
  qty: z.number().default(0),
})

export const productImageSchema = z.object({
  id: z.number(),
  image_url: z.string(),
  position: z.number(),
})

// the first image is the cover, so images are always kept in position order
const productImagesSchema = arrayOrEmpty(productImageSchema).transform(
  (images) =>
    [...images].sort((a, b) => a.position - b.position || a.id - b.id),
)

export const variantValueListingSchema = z.object({
  id: z.number(),
  price_cents: z.number().default(0),
  qty: z.number().default(0),
  value: z.string(),
})

export const variantValueDetailSchema = variantValueListingSchema.extend({
  compositions: arrayOrEmpty(productCompositionSchema),
})

const variantBaseShape = {
  id: z.number(),
  is_default: z.boolean(),
  max_selected: z.number(),
  min_selected: z.number().default(0),
  name: z.string(),
}

export const variantListingSchema = z.object({
  ...variantBaseShape,
  values: z.array(variantValueListingSchema),
})

export const variantDetailSchema = z.object({
  ...variantBaseShape,
  values: z.array(variantValueDetailSchema),
})

export const productListingSchema = z.object({
  categories: arrayOrEmpty(categorySchema),
  id: z.number(),
  name: z.string(),
  product_images: productImagesSchema,
  variants: z.array(variantListingSchema),
})

export const productDetailSchema = z.object({
  categories: arrayOrEmpty(categorySchema),
  id: z.number(),
  name: z.string(),
  product_images: productImagesSchema,
  store_id: z.number(),
  variants: z.array(variantDetailSchema),
})

export const compositionFormSchema = z.object({
  bpsp_id: z.number().nullable(),
  id: z.number().optional(),
  qty: z.number().default(0),
  raw_material_id: z.number().nullable(),
  // form-only, decides which picker a row shows, never sent to the API
  source: z.enum(['bpsp', 'raw_material']).default('bpsp'),
})

export const variantValueFormSchema = z.object({
  compositions: z.array(compositionFormSchema).default([]),
  id: z.number().optional(),
  price: z.number().min(0).default(0),
  qty: z.number().int().min(0).default(0),
  value: z.string().trim().min(1, 'Value wajib diisi'),
})

export const variantFormSchema = z.object({
  id: z.number().optional(),
  is_default: z.boolean().default(false),
  max_selected: z.number().int().min(1).default(1),
  min_selected: z.number().int().min(0).default(1),
  name: z.string().trim().min(1, 'Nama varian wajib diisi'),
  values: z.array(variantValueFormSchema).min(1),
})

export const emptyValueForm = {
  compositions: [],
  price: 0,
  qty: 0,
  value: '',
}

export const emptyVariantForm = {
  is_default: false,
  max_selected: 1,
  min_selected: 1,
  name: '',
  values: [emptyValueForm],
}

export const defaultVariantForm = {
  is_default: true,
  max_selected: 1,
  min_selected: 1,
  name: 'default',
  values: [{ ...emptyValueForm, value: 'default' }],
}

const normalizeName = (val: string) => val.trim().toLowerCase()

export const productFormSchema = z
  .object({
    category_ids: z.array(z.number()).default([]),
    id: z.number().optional(),
    name: z.string().trim().min(1, 'Nama produk wajib diisi'),
    product_images: z.array(productImageSchema.partial()).default([]),
    store_id: z.number().optional(),
    variants: z.array(variantFormSchema).min(1).default([defaultVariantForm]),
  })
  .superRefine((form, ctx) => {
    const addIssue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: 'custom', message, path })
    const variantNames = new Set<string>()

    form.variants.forEach((variant, vi) => {
      const variantName = normalizeName(variant.name)
      if (variantNames.has(variantName)) {
        addIssue(['variants', vi, 'name'], 'Nama varian duplikat')
      }
      variantNames.add(variantName)

      if (variant.min_selected > variant.max_selected) {
        addIssue(
          ['variants', vi, 'min_selected'],
          'Minimal pilihan tidak boleh melebihi maksimal',
        )
      }

      if (variant.max_selected > variant.values.length) {
        addIssue(
          ['variants', vi, 'max_selected'],
          'Maksimal pilihan tidak boleh melebihi jumlah value',
        )
      }

      const valueNames = new Set<string>()
      variant.values.forEach((value, vj) => {
        const valuePath = ['variants', vi, 'values', vj]
        const valueName = normalizeName(value.value)
        if (valueNames.has(valueName)) {
          addIssue([...valuePath, 'value'], 'Value duplikat dalam varian')
        }
        valueNames.add(valueName)

        const hasCompositions = value.compositions.length > 0
        if (hasCompositions && value.qty > 0) {
          addIssue(
            [...valuePath, 'qty'],
            'Isi stok atau komposisi, bukan keduanya',
          )
        }
        if (!hasCompositions && value.qty <= 0) {
          addIssue([...valuePath, 'qty'], 'Isi stok atau tambahkan komposisi')
        }

        const compositionKeys = new Set<string>()
        value.compositions.forEach((composition, ci) => {
          const compositionPath = [...valuePath, 'compositions', ci]
          const hasBpsp = composition.bpsp_id !== null
          const hasRawMaterial = composition.raw_material_id !== null
          const isRawMaterial = composition.source === 'raw_material'
          if (hasBpsp === hasRawMaterial) {
            addIssue(
              [
                ...compositionPath,
                isRawMaterial ? 'raw_material_id' : 'bpsp_id',
              ],
              isRawMaterial ? 'Pilih bahan baku' : 'Pilih BPSP',
            )
          }
          if (composition.qty <= 0) {
            addIssue([...compositionPath, 'qty'], 'Qty harus lebih dari 0')
          }
          const key = hasBpsp
            ? `bpsp-${composition.bpsp_id}`
            : `raw-${composition.raw_material_id}`
          if (compositionKeys.has(key)) {
            addIssue(
              [
                ...compositionPath,
                isRawMaterial ? 'raw_material_id' : 'bpsp_id',
              ],
              'Komposisi duplikat',
            )
          }
          compositionKeys.add(key)
        })
      })
    })
  })

export type ProductListing = z.infer<typeof productListingSchema>
export type ProductDetail = z.infer<typeof productDetailSchema>
export type VariantListing = ProductListing['variants'][number]
export type VariantValueListing = VariantListing['values'][number]

export type Composition = z.infer<typeof compositionFormSchema>
export type ProductForm = z.infer<typeof productFormSchema>
export type ProductFormInput = z.input<typeof productFormSchema>

type CompositionRequest = {
  bpsp_id?: number
  qty: number
  raw_material_id?: number
}

type VariantRequest = {
  id?: number
  max_selected: number
  min_selected: number
  name: string
  values: {
    compositions: CompositionRequest[]
    id?: number
    price_cents: number
    qty: number
    value: string
  }[]
}

export type ProductRequest = {
  category_ids?: number[]
  id?: number
  name: string
  product_images?: { image_url: string }[]
  store_id?: number
} & (
  | { variants: VariantRequest[] }
  | {
      compositions?: CompositionRequest[]
      price_cents: number
      stock_qty?: number
    }
)

export type ProductState = ActionStoreInterface & {
  count: number
  product: ProductDetail | undefined
  products: ProductListing[]

  createProduct: (body: ProductRequest) => void
  getProduct: (isPublic: boolean) => (id: number) => void
  getProducts: (isPublic: boolean) => (params: GetProductParams) => void
  updateProduct: (body: ProductRequest) => void

  reset: () => void
}
