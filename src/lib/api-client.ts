
/**
 * @fileoverview Centralized API client for the Zporter application.
 * This module provides a single, configured instance of a fetch-based client
 * for interacting with the backend API. It handles base URL configuration,
 * authentication headers, and consistent error handling.
 */

// Retrieves the auth token and user ID from localStorage.
const getAuthCredentials = (): { token: string | null; userId: string | null } => {
  // Ensure this code runs only on the client-side
  if (typeof window !== 'undefined') {
    return {
        token: localStorage.getItem("zporter-id-token"),
        userId: localStorage.getItem("zporter-local-id"),
    };
  }
  return { token: null, userId: null };
};

// The base URL for the API, configured via environment variables.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type ApiClientOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
  params?: Record<string, any>; // <-- Added for query parameters
};

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Performs a request to the backend API.
 * @param path The endpoint path (e.g., '/api/matches').
 * @param options Configuration for the request (method, body, headers, params).
 * @returns A promise that resolves with the JSON response from the API.
 * @throws {ApiError} If the API response is not successful.
 */
export async function apiClient<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, params } = options;
  const { token, userId } = getAuthCredentials();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If a token exists, add the Authorization and roleid headers.
  if (token && userId) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
    defaultHeaders['roleid'] = userId;
  }

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }
  
  const fullUrl = url.toString();

  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }
  
  // Log the outgoing request
  console.log(`[API REQUEST - ${method} ${fullUrl}]:`, {
    headers: config.headers,
    body: body ? JSON.stringify(body, null, 2) : 'No body',
  });


  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'An unknown error occurred.' };
    }

    console.error(`[API ERROR - ${method} ${path}]:`, JSON.stringify({
      status: response.status,
      data: errorData,
    }, null, 2));
    
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  // Handle cases with no content in response (e.g., 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  const responseData = await response.json();
  
  console.log(`[API RESPONSE - ${method} ${path}]:`, JSON.stringify(responseData, null, 2));

  return responseData;
}
