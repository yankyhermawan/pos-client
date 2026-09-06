export type Cart = {
  product_id: number
  qty: number
}

export type StoreCart = {
  cart: Cart[]
  store_id: number
}
