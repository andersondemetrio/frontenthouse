import axios from "axios";
import { API_URL } from "./constants";

export const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Request error:", JSON.stringify(error, null, 2));
    return Promise.reject(error);
  },
);


export const isCreated = (status: number) => status === 201;
export const isBadRequest = (status: number) => status === 400;
export const isUnauthorized = (status: number) => status === 401;
export const isForbidden = (status: number) => status === 403;
export const isNotFound = (status: number) => status === 404;
export const isConflict = (status: number) => status === 409;
export const isInternalServerError = (status: number) => status === 500;
export const isServiceUnavailable = (status: number) => status === 503;
export const isGatewayTimeout = (status: number) => status === 504;
export const isOk = (status: number) => status === 200;
