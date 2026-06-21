import { get } from '../utility/requests'
import type { GetMeData } from './interface'

export const getMe = () => get<GetMeData>('/user/me')
