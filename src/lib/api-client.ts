/**
 * @fileoverview Centralized API client for the Zporter application.
 * This module provides a single, configured instance of a fetch-based client
 * for interacting with the backend API. It handles base URL configuration,
 * authentication headers, and consistent error handling.
 */

// Retrieves the auth token from localStorage.
const getAuthToken = (): string | null => {
  // Ensure this code runs only on the client-side
  if (typeof window !== 'undefined') {
    return localStorage.getItem("zporter-api-token") || null;
  }
  return null;
};

// The base URL for the API, configured via environment variables.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

type ApiClientOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
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
 * @param path The endpoint path (e.g., '/matches').
 * @param options Configuration for the request (method, body, headers).
 * @returns A promise that resolves with the JSON response from the API.
 * @throws {ApiError} If the API response is not successful.
 */
export async function apiClient<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const token = getAuthToken();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

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

  const response = await fetch(`${API_BASE_URL}${path}`, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'An unknown error occurred.' };
    }

    console.error(`[API ERROR - ${method} ${path}]:`, {
      status: response.status,
      data: errorData,
    });
    
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
