import { Response } from 'express';

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export const sendResponse = (
  res: Response,
  status: HttpStatus,
  message: string,
  data?: any,
  error?: any
) => {
  const success = status >= 200 && status < 300;
  const response: ApiResponse = {
    success,
    message,
    data,
    error,
  };
  return res.status(status).json(response);
};
