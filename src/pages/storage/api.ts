import { postFile } from '../utility/requests'

export const postStorage = (path: string, file: FormData) =>
  postFile(`/storage/${path}`, file)
