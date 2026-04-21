import { useSessionStore } from '@/stores';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

const instance = axios.create({
    baseURL: 'https://api-gateway-anticounterfeit.diggitonline.com/',
    timeout: 20000,
});

export type AllowedMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export type APIResponse<T = any> = {
    status: boolean;
    message?: string;
    result: T;
    selfiefileId?: string;
    frontImgfileId?: string;
    backImgfileId?: string;
};

export type StrictAxiosConfig<Payload> = Omit<AxiosRequestConfig<Payload>, 'method'> & {
    method: AllowedMethods;
};

export function useAxiosRequest<Result, Payload = unknown>() {
    const [data, setData] = useState<Result | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const sendRequest = useCallback(
        async (config: StrictAxiosConfig<Payload>): Promise<APIResponse<Result>> => {
            setLoading(true);
            setError(null);
            try {
                const response: AxiosResponse<APIResponse<Result>> = await instance.request<
                    APIResponse<Result>,
                    AxiosResponse<APIResponse<Result>>,
                    Payload
                >(config);

                !response.data.status &&
                    showMessage({
                        type: 'danger',
                        message: response.data.message || 'An error occurred',
                    });

                setMessage(response.data.message ?? '');
                setData(response.data.result);
                return response.data;
            } catch (err: any) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { data, loading, error, message, sendRequest };
}

function logAxiosError(error: AxiosError) {
    if (error.response) {
        console.log('🧾 AXIOS RESPONSE ERROR:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
            url: error.config?.url,
            method: error.config?.method,
        });
    } else if (error.request) {
        console.log('📡 AXIOS REQUEST ERROR:', error.request);
    } else {
        console.log('❌ AXIOS GENERAL ERROR:', error.message);
    }

    // Optional: full raw dump
    // console.log('FULL ERROR OBJECT:', JSON.stringify(error, null, 2));
}

instance.interceptors.request.use(
    (config) => {
        // You can add headers or other configurations here if needed
        const token = useSessionStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        logAxiosError(error);
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        logAxiosError(error);
        const getSession = useSessionStore.getState();
        // Check for 401 Unauthorized
        if (error.response?.status === 401) {
            showMessage({
                message: 'Session expired. Please log in again.',
                type: 'danger',
            });
            getSession.signOut();
        } else {
            const title =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data?.title ||
                error.message;

            showMessage({
                message: title || 'Something went wrong',
                type: 'danger',
            });
        }

        return Promise.reject(error);
    },
);
