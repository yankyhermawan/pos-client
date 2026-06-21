export type DefaultStoreInterface = {
  isLoading: boolean
  isError: boolean
}

export type ActionStoreInterface = DefaultStoreInterface & {
  isActionLoading: boolean
  isActionSuccess: boolean
}

export type Sort = {
  by: string
  order: 'ASC' | 'DESC'
}

export type DefaultPaginationQuery = {
  limit: number
  offset: number
  sort: Sort[]
}

export type PaginationResponse<T extends object> = {
  count: number
  data: T
}

export type TableRowActionType = 'edit' | 'delete' | 'view'
