import { useSessionStore } from '@/stores';
import { ScanActionPayload, ScanItem, ScanItemState, ScanReducerState } from '@/types';
import { useEffect, useReducer } from 'react';
import { useAxiosRequest } from './useAxiosRequest';

const reducer = (state: ScanReducerState, action: ScanActionPayload): ScanReducerState => {
    switch (action.type) {
        case 'PAGE':
            return { ...state, page: action.payload };

        case 'STATUS':
            return { ...state, status: action.payload, page: 1 };

        case 'REFRESH':
            return { ...state, refreshTrigger: !state.refreshTrigger, scans: [], page: 1 };

        case 'SCANS':
            return {
                ...state,
                scans:
                    state.page === 1 ? action.payload : [...(state.scans ?? []), ...action.payload],
            };

        // case 'REMOVE_BOOKING':
        //     return {
        //         ...state,
        //         bookings: state.bookings?.filter((b) => b.id !== action.payload) ?? null,
        //     };

        default:
            return state;
    }
};

export function useListScans(status: ScanItemState = ScanItemState.All, limit = 10) {
    const [state, dispatch] = useReducer(reducer, {
        page: 1,
        status,
        scans: null,
        refreshTrigger: false,
    });

    const { token } = useSessionStore();

    const { sendRequest, loading, data } = useAxiosRequest<{
        data: ScanItem[];
    }>();

    useEffect(() => {
        async function fetchBookings() {
            try {
                let url = '';
                if (state.status === ScanItemState.Genuine) {
                    url = `api/v1/client/Product/scan-history?pageNumber=${state.page}&pageSize=${limit}&isGenuine=true`;
                } else if (state.status === ScanItemState.Fake) {
                    url = `api/v1/client/Product/scan-history?pageNumber=${state.page}&pageSize=${limit}&isGenuine=false`;
                } else {
                    url = `api/v1/client/Product/scan-history?pageNumber=${state.page}&pageSize=${limit}`;
                }
                console.log('url: ', url)
                const { result } = await sendRequest({
                    url,
                    method: 'GET',
                });
                const items = result?.data ?? [];
                if (items.length > 0) {
                    dispatch({ type: 'SCANS', payload: items });
                } else if (state.page === 1) {
                    dispatch({ type: 'SCANS', payload: [] });
                }
            } catch (err) {
                console.warn('fetchBookings error', err);
            }
        }

        fetchBookings();
    }, [state.status, state.page, state.refreshTrigger, sendRequest]);

    return { state, dispatch, loading, data };
}
