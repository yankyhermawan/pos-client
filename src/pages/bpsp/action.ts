import type { PaginationResponse } from '../utility/global_interface'
import { get } from '../utility/requests'
import type { Bpsp, GetBpspParams } from './interface'

export const getBpsps = (params: GetBpspParams) =>
  get<PaginationResponse<Bpsp[]>>('/bpsp/all', params)
export const getBpsp = (id: number) => get<Bpsp>(`/bpsp/${id}`)
