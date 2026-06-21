import z from 'zod'
import { requiredString } from '../utility/form_validation'

export const LoginFormSchema = z.object({
  username: requiredString(),
  password: requiredString(),
})
