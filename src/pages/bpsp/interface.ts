import type {
  ActionStoreInterface,
  DefaultPaginationQuery,
} from '../utility/global_interface'

export type Bpsp = {
  id: number
  name: string
  store_id: number
}

export type GetBpspParams = DefaultPaginationQuery & {
  name?: string
  id?: number
}

export type BpspState = ActionStoreInterface & {
  bpsp: Bpsp | undefined
  bpsps: Bpsp[]
  count: number

  getBpsp: (id: number) => void
  getBpsps: (params: GetBpspParams) => void
}
