import type {
  ActionStoreInterface,
  DefaultPaginationQuery,
} from '../utility/global_interface'

export type GetProductParams = DefaultPaginationQuery & {
  store_id?: number
  name?: string
  id?: number
}

export type Composition = {
  bpsp_id: number | null
  id?: number
  product_id?: number
  qty: number
  raw_material_id: number | null
}

type ProductImages = {
  id?: number
  image_url: string
  product_id?: number
}

export type Product = {
  compositions: Composition[]
  id: number
  name: string
  store_id: number
  stock_qty: number
  price: number
  product_images: ProductImages[]
}

export type ProductState = ActionStoreInterface & {
  count: number
  product: Product | undefined
  products: Product[]

  getProduct: (isPublic: boolean) => (id: number) => void
  getProducts: (isPublic: boolean) => (params: GetProductParams) => void
  updateProduct: (body: Product) => void

  reset: () => void
}
