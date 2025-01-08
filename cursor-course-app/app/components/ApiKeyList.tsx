'use client'

import { useState } from 'react'
import { ApiKey } from '@/app/types/api'

interface ApiKeyListProps {
  apiKeys: ApiKey[]
  onEdit: (id: string, name: string) => void
  onDelete: (id: string) => void
  onCopy: (text: string) => void
}

export const ApiKeyList = ({ apiKeys, onEdit, onDelete, onCopy }: ApiKeyListProps) => {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  return (
    <div className="divide-y divide-gray-100">
      {apiKeys.map((key) => (
        <div key={key.id} className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-gray-50/50">
          <div>
            {editingKey === key.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-2 py-1 border rounded text-gray-900 w-full text-sm"
                autoFocus
              />
            ) : (
              <span className="text-gray-900 text-sm">{key.name}</span>
            )}
          </div>

          <div className="text-gray-500 text-sm">
            {key.lastUsed ? '24' : '0'}
          </div>

          <div className="flex items-center gap-2">
            <code className="text-sm text-gray-600 font-mono">
              {visibleKeys.has(key.id) 
                ? key.key 
                : key.key.replace(/^(key-number-\d{2})\d+$/, '$1•••••')}
            </code>
            <button
              onClick={() => toggleKeyVisibility(key.id)}
              className="text-gray-400 hover:text-gray-600"
              title={visibleKeys.has(key.id) ? "Hide API key" : "Show API key"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {visibleKeys.has(key.id) ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={() => onCopy(key.key)}
              className="text-gray-400 hover:text-gray-600"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>

          <div className="flex justify-end gap-2">
            {editingKey === key.id ? (
              <>
                <button
                  onClick={() => {
                    onEdit(key.id, editName)
                    setEditingKey(null)
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingKey(null)
                    setEditName('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingKey(key.id)
                    setEditName(key.name)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  title="Edit API key"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(key.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete API key"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 