import { post } from '../utility/requests'
import type { LoginResponse, LoginFormType } from './interface'


export const login = (body: LoginFormType) => post<LoginResponse>('/auth/login', body)