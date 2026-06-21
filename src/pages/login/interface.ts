import type z from 'zod'
import type { LoginFormSchema } from './schema'
import type { ActionStoreInterface } from '../utility/global_interface'

export type LoginFormType = z.infer<typeof LoginFormSchema>
export type LoginResponse = { token: string }

export type LoginStore = ActionStoreInterface & {
  data: LoginResponse | undefined

  login: (body: LoginFormType) => void
}
