import type { PaginationResponse } from '../utility/global_interface'
import { get } from '../utility/requests'
import { type GetProductParams, type Product } from './interface'

export const getProducts = (params: GetProductParams) =>
  get<PaginationResponse<Product[]>>('/product/', params)
