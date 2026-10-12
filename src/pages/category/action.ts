import { get, post, put } from '../utility/requests'
import type { Category, CategoryCreateForm, CategoryForm } from './interface'

export const getCategories = () => get<Category[]>('/category')
export const getPublicCategories = (storeId: number) =>
  get<Category[]>('/public/category', { store_id: storeId })
export const createCategory = (body: CategoryCreateForm) =>
  post('/category', body)
export const updateCategory = (body: CategoryForm) => put('/category', body)
