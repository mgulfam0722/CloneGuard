import { useEffect, useReducer } from 'react';
import { useAxiosRequest } from './useAxiosRequest';

export interface PaginatedListState<T> {
    page: number;
    list: T[] | null;
    refreshTrigger: boolean;
}

export type PaginatedListAction<T> =
    | { type: 'PAGE'; payload: number }
    | { type: 'REFRESH' }
    | { type: 'LIST'; payload: T[] };

const createReducer = <T>() => {
    return (
        state: PaginatedListState<T>,
        action: PaginatedListAction<T>,
    ): PaginatedListState<T> => {
        switch (action.type) {
            case 'PAGE':
                return { ...state, page: action.payload };

            case 'REFRESH':
                return { ...state, refreshTrigger: !state.refreshTrigger, list: [], page: 1 };

            case 'LIST':
                return {
                    ...state,
                    list:
                        state.page === 1
                            ? action.payload
                            : [...(state.list ?? []), ...action.payload],
                };

            default:
                return state;
        }
    };
};

interface UsePaginatedListOptions {
    limit?: number;
    onFetchError?: (error: unknown) => void;
}

export function usePaginatedList<T>(
    fetchUrl: (page: number, limit: number) => string,
    options: UsePaginatedListOptions = {},
) {
    const { limit = 10, onFetchError } = options;

    const reducer = createReducer<T>();
    const [state, dispatch] = useReducer(reducer, {
        page: 1,
        list: null,
        refreshTrigger: false,
    });

    const { sendRequest, loading, data } = useAxiosRequest<{
        data: T[];
    }>();

    useEffect(() => {
        async function fetchList() {
            try {
                const url = fetchUrl(state.page, limit);
                const { result } = await sendRequest({
                    url,
                    method: 'GET',
                });
                const items = result?.data ?? [];
                if (items.length > 0) {
                    dispatch({ type: 'LIST', payload: items });
                } else if (state.page === 1) {
                    dispatch({ type: 'LIST', payload: [] });
                }
            } catch (err) {
                console.warn('fetchList error', err);
                if (onFetchError) {
                    onFetchError(err);
                }
            }
        }

        fetchList();
    }, [state.page, state.refreshTrigger, sendRequest, limit, fetchUrl, onFetchError]);

    return { state, dispatch, loading, data };
}
