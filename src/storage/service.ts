import type { AxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'user-token';

export const TokenService = {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },
};

export const AxiosConfig: AxiosRequestConfig = {
    headers: {
        Authorization: 'Token ' + TokenService.getToken(),
    },
};

// API is served on the same origin as the front (nginx) unless overridden
// (e.g. VITE_API_HOST / VITE_API_PROTO for the Vite dev server).
export const PROTO: string =
    import.meta.env.VITE_API_PROTO || window.location.protocol.replace(':', '');

export const API_HOST: string =
    import.meta.env.VITE_API_HOST || window.location.host;
