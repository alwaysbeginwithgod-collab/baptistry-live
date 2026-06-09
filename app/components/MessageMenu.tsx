'use client';

import { useState } from 'react';

interface MessageMenuProps {
  messageId: string;
  content: string;
  role: 'user' | 'assistant';
  onEdit: (messageId: string, newContent: string) => void;
}

export function MessageMenu({ messageId, content, role, onEdit }: MessageMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(content);

  // Only show menu for user messages
  if (role !== 'user') return null;

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSave = () => {
    if (editedText.trim() && editedText !== content) {
      onEdit(messageId, editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(content);
  };

  if (isEditing) {
    return (
      <div className="mt-2">
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save & Resend
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded"
        title="Edit message"
      >
        ⋮
      </button>
      
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-1 z-20 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
            <button
              onClick={handleEdit}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              ✏️ Edit message
            </button>
          </div>
        </>
      )}
    </div>
  );
}