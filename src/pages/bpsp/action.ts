import type { PaginationResponse } from '../utility/global_interface'
import { get, post, put } from '../utility/requests'
import type {
  BpspCreateForm,
  BpspDetail,
  BpspForm,
  BpspListing,
  GetBpspParams,
} from './interface'

export const getBpsps = (params: GetBpspParams) =>
  get<PaginationResponse<BpspListing[]>>('/bpsp', params)
export const getBpsp = (id: number) => get<BpspDetail>(`/bpsp/${id}`)
export const updateBpsp = (body: BpspForm) => put('/bpsp', body)
export const createBpsp = (body: BpspCreateForm) => post('/bpsp', body)
