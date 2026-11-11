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

export const PROTO: string =
    import.meta.env.MODE === 'production' ? 'https' : 'http';

export const API_HOST = '127.0.0.1';
