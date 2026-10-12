import type { PaginationResponse } from '../utility/global_interface'
import { get, post, put } from '../utility/requests'
import {
  type GetProductParams,
  type ProductDetail,
  type ProductRequest,
  type ProductListing,
} from './interface'

export const createProduct = (body: ProductRequest) => post('/product', body)

export const getProducts = (params: GetProductParams) =>
  get<PaginationResponse<ProductListing[]>>('/product', params)

export const getProduct = (id: number) => get<ProductDetail>(`/product/${id}`)

export const updateProduct = (body: ProductRequest) => put('/product', body)

export const getPublicProducts = (params: GetProductParams) =>
  get<PaginationResponse<ProductListing[]>>('/public/product', params)

export const getPublicProduct = (id: number) =>
  get<ProductDetail>(`/public/product/${id}`)
