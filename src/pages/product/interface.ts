import type {
  ActionStoreInterface,
  DefaultPaginationQuery,
} from '../utility/global_interface'

export type GetProductParams = DefaultPaginationQuery & {
  name?: string
  id?: number
  store_id: number
}

export type Product = {
  id: number
  name: string
  store_id: number
  stock_qty: number
  image_url: string
  price: number
}

export type ProductState = ActionStoreInterface & {
  count: number
  product: Product | undefined
  products: Product[]

  getProducts: (params: GetProductParams) => void
}
