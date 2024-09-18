// pages/api/auth.ts

import { getAuthHeaders } from '@/utils/apiClient';

export const fetchUsers = async () => {
    const header= getAuthHeaders();
    console.log(header)
  const response = await fetch('/users', {
    method: 'GET',
    headers: header,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};
