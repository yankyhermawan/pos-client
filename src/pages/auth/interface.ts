import type { DefaultStoreInterface } from '../utility/global_interface'

export type Company = {
  id: number
  name: string
}

export type Store = Company & {
  company_id: number
}

export type GetMeData = {
  companies: Company[]
  id: number
  name: string
  stores: Store[]
}

export type AuthStore = DefaultStoreInterface & {
  data: GetMeData | undefined
  getMe: () => void
}
