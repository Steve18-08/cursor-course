'use client'

import { useState } from 'react'
import { Sidebar } from '@/app/components/Sidebar'

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' })

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (data.success) {
        showNotification('Valid API key, /protected can be accessed', 'success')
        // Redirect to protected page after a short delay
        setTimeout(() => {
          window.location.href = '/protected'
        }, 1500)
      } else {
        // Show the specific error message from the API
        showNotification(data.error || 'Error validating API key', 'error')
        // Clear the input if it's an invalid key
        setApiKey('')
      }
    } catch (error) {
      showNotification('Error connecting to server', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <div className="relative min-h-screen">
          <div className="pl-[32px] lg:pl-64 transition-all duration-300">
            <div className="max-w-[1200px] mx-auto px-6 py-8">
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

              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  API Playground
                </h1>
                <form onSubmit={handleSubmit} className="max-w-md">
                  <div className="mb-4">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                      placeholder="Enter your API key"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-md 
                      hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 
                      focus:ring-offset-2 flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Validating...
                      </>
                    ) : (
                      'Validate Key'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 