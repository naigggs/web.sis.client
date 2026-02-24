export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors: ApiError[]
  pagination: Pagination | null
  metadata: Metadata
}

export interface ApiError {
  code: string
  message: string
  path?: string[]
}

export interface Pagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface Metadata {
  requestId: string
  version: string
  timestamp: string
  serverTime: string
}
