import type { ActionStoreInterface } from '../utility/global_interface'

export type StorageState = ActionStoreInterface & {
  files: string[]

  // getFiles: (path: string) => void
  uploadFiles: (path: string, file: FormData) => void
  resetFiles: () => void
}
