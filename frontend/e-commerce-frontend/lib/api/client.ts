// HTTP API Client with Sanctum Interceptors Scaffolding & Demo Mode
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// By default in our frontend demo, we enable Demo Mode so no failing network calls clutter browser console
export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (IS_DEMO_MODE) {
    throw new Error('DEMO_MODE_ACTIVE');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

