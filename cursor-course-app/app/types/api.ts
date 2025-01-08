export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
}

export interface NotificationType {
  show: boolean
  message: string
  type: 'success' | 'error'
}

export interface DeleteConfirmationType {
  show: boolean
  keyId: string | null
} 