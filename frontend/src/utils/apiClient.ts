// utils/apiClient.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const authHeaders = getAuthHeaders();

  // Check if the body is FormData (for file uploads)
  const isFormData = options.body instanceof FormData;

  // Merge headers correctly based on whether it's FormData
  const headers: HeadersInit = isFormData
    ? { ...authHeaders } // No 'Content-Type' for FormData
    : {
        'Content-Type': 'application/json', // Default to JSON
        ...authHeaders,
        ...(options.headers || {}), // Include any additional headers
      };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    // Return JSON response (or other format if necessary)
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
