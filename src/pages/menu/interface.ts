export type Cart = {
  product_id: number
  qty: number
  value_ids: number[]
}

export type StoreCart = {
  cart: Cart[]
  store_id: number
}
