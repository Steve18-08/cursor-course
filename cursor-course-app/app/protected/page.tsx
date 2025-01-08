export default function ProtectedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Protected Page</h1>
        <p className="text-gray-600">
          This page is only accessible with a valid API key.
        </p>
      </div>
    </div>
  )
} 