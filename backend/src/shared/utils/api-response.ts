import type { IApiResponse } from "../models/api-response.model.js";

export function createApiResponse<T>(
  code: string,
  message: string,
  data: T,
): IApiResponse<T> {
  return {
    code,
    message,
    data,
  };
}
