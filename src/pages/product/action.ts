import type { PaginationResponse } from '../utility/global_interface'
import { get, put } from '../utility/requests'
import { type GetProductParams, type Product } from './interface'

export const getProducts = (params: GetProductParams) =>
  get<PaginationResponse<Product[]>>('/product', params)

export const getProduct = (id: number) => get<Product>(`/product/${id}`)

export const updateProduct = (body: Product) => put('/product', body)

export const getPublicProducts = (params: GetProductParams) =>
  get<PaginationResponse<Product[]>>('/public/product', params)

export const getPublicProduct = (id: number) =>
  get<Product>(`/public/product/${id}`)
