// import { CaptionsResponse, GeneralResponse } from './types';

interface ApiResponse<T> {
  data: T | null | JSON;
  status: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      if (!response.ok) {
        return { data: null, status: response.status };
      }
      const data = await response.json() as T;
      return { data, status: response.status };
    } catch (error) {
      console.error('Error in GET request:', error);
      return { data: null, status: 500 }; // Internal Server Error
    }
  }

  async post<T, U>(
    endpoint: string,
    data: U,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });
      const resdata = await response.json() as T;
      return { data: resdata, status: response.status };
    } catch (error) {
      console.error('Error in POST request:', error);
      return { data: null, status: 500 }; // Internal Server Error
    }
  }
}