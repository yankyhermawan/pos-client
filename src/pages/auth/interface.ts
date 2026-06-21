import type { DefaultStoreInterface } from '../utility/global_interface'

type CompanyStore = {
  id: number
  name: string
}

export type GetMeData = {
  companies: CompanyStore[]
  id: number
  name: string
  stores: CompanyStore[]
}

export type AuthStore = DefaultStoreInterface & {
  data: GetMeData | undefined
  getMe: () => void
}
