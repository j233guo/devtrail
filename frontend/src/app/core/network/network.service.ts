import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

// Defines known backend response codes used by the API contract.
export enum ApiResponseCode {
  OK = 'OK',
  CREATED = 'CREATED',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// Represents the shared API response wrapper returned by backend endpoints.
export interface IApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// Represents the backend health check response payload.
export interface IHealthResponse {
  status: string;
  service: string;
}

// Represents the database health check response payload.
export interface IDbHealthResponse {
  status: string;
  database: string;
}

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private readonly http = inject(HttpClient);

  // Sends a GET request and returns the shared API response wrapper.
  get<T>(url: string): Observable<IApiResponse<T>> {
    return this.http.get<IApiResponse<T>>(url);
  }

  // Sends a POST request with a typed payload and response body.
  post<T, TPayload>(url: string, payload: TPayload): Observable<IApiResponse<T>> {
    return this.http.post<IApiResponse<T>>(url, payload);
  }

  // Sends a PUT request with a typed payload and response body.
  put<T, TPayload>(url: string, payload: TPayload): Observable<IApiResponse<T>> {
    return this.http.put<IApiResponse<T>>(url, payload);
  }

  // Sends a DELETE request and returns the shared API response wrapper.
  delete<T>(url: string): Observable<IApiResponse<T>> {
    return this.http.delete<IApiResponse<T>>(url);
  }

  // Checks whether a response uses a successful API response code.
  isSuccess(response: IApiResponse<unknown>): boolean {
    return response.code === ApiResponseCode.OK || response.code === ApiResponseCode.CREATED;
  }

  // Reads the human-readable message from an API response.
  getMessage(response: IApiResponse<unknown>): string {
    return response.message;
  }

  // Loads backend health through the shared network layer.
  getHealth(): Observable<IApiResponse<IHealthResponse>> {
    return this.get<IHealthResponse>('/api/health');
  }

  // Loads database health through the shared network layer.
  getDbHealth(): Observable<IApiResponse<IDbHealthResponse>> {
    return this.get<IDbHealthResponse>('/api/db/health');
  }
}
