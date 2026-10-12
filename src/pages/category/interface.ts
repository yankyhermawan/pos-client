import z from 'zod'
import type {
  ActionStoreInterface,
  DefaultStoreInterface,
} from '../utility/global_interface'

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const categoryFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .trim()
    .min(1, 'Nama wajib diisi')
    .max(255, 'Nama maksimal 255 karakter'),
})

export type Category = z.infer<typeof categorySchema>
export type CategoryForm = z.infer<typeof categoryFormSchema>
export type CategoryCreateForm = Omit<CategoryForm, 'id'>

export type CategoryState = ActionStoreInterface &
  DefaultStoreInterface & {
    categories: Category[]

    getCategories: (isPublic: boolean) => (storeId?: number) => void
    createCategory: (body: CategoryCreateForm) => void
    updateCategory: (body: CategoryForm) => void

    reset: () => void
  }
