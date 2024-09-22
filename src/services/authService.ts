import axios, { AxiosError } from 'axios';
import {jwtDecode, JwtPayload } from 'jwt-decode';
import {api, handleApiError} from '@/services/api'
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import {GetServerSidePropsContext, NextPageContext} from 'next';


// URL da API (substitua pelo URL real da sua API)

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export const login = async (username: string, password: string): Promise<User> => {
    try {
        const response = await api.post<LoginResponse>(`auth/login/`, { username, password });
        const { access, refresh } = response.data;
        setTokens(access, refresh);
        return jwtDecode(access);
    } catch (error) {
        handleApiError(error);
        throw new Error("Index failed");
    }
};

export const register = async (userData: { username: string; password: string; email: string }): Promise<void> => {
    try {
        await api.post(`$auth/register/`, userData);
    } catch (error) {
        handleApiError(error);
    }
};

export const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    const accessToken = getAccessToken();
    try {
        await api.post(
            `/auth/logout/`,
            { refresh: refreshToken },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        clearTokens();
    } catch (error) {
        handleApiError(error);
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return null;
    }
    try {
        const response = await api.get<User>(`auth/user/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
            await refreshToken();
            return getCurrentUser();
        }
        handleApiError(error);
    }
    return null;
};

export const refreshToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();
    try {
        const response = await api.post(`auth/token/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
        setRefreshToken(response.data.refresh);
        return newAccessToken;
    } catch (error) {
        handleApiError(error);
        throw new Error("Failed to refresh token");
    }
};

// Function to get access token
export const getAccessToken = (ctx?: GetServerSidePropsContext): string | null => {
    const cookies = parseCookies(ctx);
    console.log("cookies: ", cookies);
    return cookies['access'] || null;
};

// Function to get refresh token
export const getRefreshToken = (ctx?: GetServerSidePropsContext): string | null => {
    const cookies = parseCookies(ctx);
    return cookies['refresh'] || null;
};

// Function to set access token
export const setAccessToken = (token: string, ctx?: NextPageContext): void => {
    setCookie(ctx, 'access', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        secure: true,
        sameSite: 'Strict',
    });
};

// Function to set refresh token
export const setRefreshToken = (token: string, ctx?: NextPageContext): void => {
    setCookie(ctx, 'refresh', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        secure: true,
        sameSite: 'Strict',
    });
};

// Function to set both tokens
export const setTokens = (access: string, refresh: string, ctx?: NextPageContext): void => {
    setAccessToken(access, ctx);
    setRefreshToken(refresh, ctx);
};

// Function to clear tokens
export const clearTokens = (ctx?: NextPageContext): void => {
    destroyCookie(ctx, 'access', { path: '/' });
    destroyCookie(ctx, 'refresh', { path: '/' });
};

// Function to set Authorization header
export const setAuthHeader = (token: string): void => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
        return true;
    }
    const now = Date.now().valueOf() / 1000;
    return decoded.exp < now;
};