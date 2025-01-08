'use client'
import { useState } from 'react';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function CreateApiKeyModal({ isOpen, onClose, onSubmit }: CreateApiKeyModalProps) {
  const [keyName, setKeyName] = useState('');

  const handleSubmit = () => {
    if (keyName.trim()) {
      onSubmit(keyName);
      setKeyName(''); // Reset the input
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6">
        <h2 className="text-xl font-medium mb-4">Create a new API key</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter a name and limit for the new API key.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Key Name — A unique name to identify this key
            </label>
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Key Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="limitUsage"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="limitUsage" className="text-sm text-gray-700">
              Limit monthly usage*
            </label>
          </div>

          <input
            type="number"
            value="1000"
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
          />

          <p className="text-xs text-gray-500">
            *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
} 