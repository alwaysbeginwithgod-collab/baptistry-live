'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

type User = {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  lastSignIn: number | null;
};

export default function UsersAdminPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.emailAddresses[0]?.emailAddress === 'always.begin.with.god@gmail.com';

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          setError(data.error || 'Failed to load users');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isLoaded, isAdmin]);

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to view this page.</p>
      </div>
    );
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">BAPTISTRY Community Growth</p>
          </div>
          <a href="/admin" className="text-blue-600 hover:underline text-sm">← Back to Updates</a>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{users.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Users</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {users.filter(u => u.lastSignIn && new Date(u.lastSignIn).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Active Today</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.name !== 'Anonymous').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Named Users</div>
          </div>
        </div>
        
        {/* User Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(u.lastSignIn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No users have signed up yet.
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Only visible to admin email: always.begin.with.god@gmail.com</p>
        </div>
      </div>
    </div>
  );
}