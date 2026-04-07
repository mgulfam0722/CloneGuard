import { useAxiosRequest } from '@/hooks';
import { useSessionStore } from '@/stores';
import { ScanActionPayload, ScanItem, ScanItemState, ScanReducerState } from '@/types';
import { useEffect, useReducer } from 'react';

const LIMIT = 10;

const reducer = (state: ScanReducerState, action: ScanActionPayload): ScanReducerState => {
    switch (action.type) {
        case 'PAGE':
            return { ...state, page: action.payload };

        case 'STATUS':
            return { ...state, status: action.payload };

        case 'REFRESH':
            return { ...state, refreshTrigger: !state.refreshTrigger };

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

export function useListScans(status: ScanItemState = ScanItemState.All) {
    const [state, dispatch] = useReducer(reducer, {
        page: 1,
        status,
        scans: null,
        refreshTrigger: false,
    });

    const { token } = useSessionStore();

    const { sendRequest, loading, data } = useAxiosRequest<ScanItem[]>();

    useEffect(() => {
        async function fetchBookings() {
            try {
                const url = `api/v1/client/Product/scan-history?page=${state.page}&limit=${LIMIT}&status=${state.status}`;

                const result = await sendRequest({
                    url,
                    method: 'GET',
                });

                console.log(result);

                const items = result?.result ?? [];

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
