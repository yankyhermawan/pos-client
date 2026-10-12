import type { PaginationResponse } from '../utility/global_interface'
import { get, post, put } from '../utility/requests'
import type {
  GetRawMaterialParams,
  RawMaterialCreateForm,
  RawMaterialDetail,
  RawMaterialForm,
  RawMaterialListing,
} from './interface'

export const getRawMaterials = (params: GetRawMaterialParams) =>
  get<PaginationResponse<RawMaterialListing[]>>('/rawmaterial', params)
export const getRawMaterial = (id: number) =>
  get<RawMaterialDetail>(`/rawmaterial/${id}`)
export const createRawMaterial = (body: RawMaterialCreateForm) =>
  post('/rawmaterial', body)
export const updateRawMaterial = (body: RawMaterialForm) =>
  put('/rawmaterial', body)
