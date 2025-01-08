'use client'

import { useState, useEffect } from 'react'
import { CreateApiKeyModal } from '../components/CreateApiKeyModal'
import { Sidebar } from '@/app/components/Sidebar'
import { GradientHeader } from '@/app/components/GradientHeader'
import { ApiKeyList } from '@/app/components/ApiKeyList'
import { apiKeyService } from '@/app/services/apiKeys'
import { ApiKey, NotificationType, DeleteConfirmationType } from '@/app/types/api'

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [notification, setNotification] = useState<NotificationType>({
    show: false,
    message: '',
    type: 'success'
  })
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationType>({
    show: false,
    keyId: null
  })

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const data = await apiKeyService.fetchApiKeys()
      setApiKeys(data)
    } catch (error) {
      console.error('Error fetching API keys:', error)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  const handleCreateApiKey = async (name: string) => {
    try {
      const data = await apiKeyService.createApiKey(name)
      setApiKeys([data, ...apiKeys])
      showNotification('API Key created successfully')
    } catch (error) {
      console.error('Failed to create API key:', error)
    }
  }

  const handleUpdateApiKey = async (id: string, name: string) => {
    try {
      await apiKeyService.updateApiKey(id, name)
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, name } : key
      ))
      showNotification('API Key updated successfully')
    } catch (error) {
      console.error('Failed to update API key:', error)
    }
  }

  const handleDeleteApiKey = async (id: string) => {
    setDeleteConfirmation({ show: true, keyId: id })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation.keyId) return
    
    try {
      await apiKeyService.deleteApiKey(deleteConfirmation.keyId)
      setApiKeys(apiKeys.filter(key => key.id !== deleteConfirmation.keyId))
      showNotification('API Key deleted successfully', 'error')
    } catch (error) {
      console.error('Failed to delete API key:', error)
    } finally {
      setDeleteConfirmation({ show: false, keyId: null })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showNotification('Copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <div className="relative min-h-screen">
          <div className="pl-[32px] lg:pl-64 transition-all duration-300">
            <div className="max-w-[1200px] mx-auto px-6 py-8">
              <GradientHeader />
              
              {notification.show && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
                  notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                } text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg animate-notification z-50`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {notification.message}
                </div>
              )}

              {deleteConfirmation.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-modal">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete API Key</h3>
                    <p className="text-gray-500 mb-4">
                      Are you sure you want to delete this API key? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setDeleteConfirmation({ show: false, keyId: null })}
                        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow">
                {/* Header section */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 
                               text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      + Create New Key
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    The key is used to authenticate your requests to the Research API. To learn more, see the documentation.
                  </p>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <div>Name</div>
                  <div>Usage</div>
                  <div>Key</div>
                  <div className="text-right">Options</div>
                </div>

                {/* API Key List */}
                {apiKeys.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No API keys found. Create one to get started.
                  </div>
                ) : (
                  <ApiKeyList
                    apiKeys={apiKeys}
                    onEdit={handleUpdateApiKey}
                    onDelete={handleDeleteApiKey}
                    onCopy={copyToClipboard}
                  />
                )}
              </div>

              <CreateApiKeyModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateApiKey}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}