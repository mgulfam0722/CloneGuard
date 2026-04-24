import { useSessionStore } from '@/stores';
import { RewardHistoryItem, RewardHistoryPayload, RewardHistoryReducerState } from '@/types';
import { useEffect, useReducer } from 'react';
import { useAxiosRequest } from './useAxiosRequest';

const reducer = (
    state: RewardHistoryReducerState,
    action: RewardHistoryPayload,
): RewardHistoryReducerState => {
    switch (action.type) {
        case 'PAGE':
            return { ...state, page: action.payload };

        case 'REFRESH':
            return { ...state, refreshTrigger: !state.refreshTrigger, list: [], page: 1 };

        case 'LIST':
            return {
                ...state,
                list:
                    state.page === 1 ? action.payload : [...(state.list ?? []), ...action.payload],
            };

        default:
            return state;
    }
};

export function useRewardHistory(limit = 10) {
    const [state, dispatch] = useReducer(reducer, {
        page: 1,
        list: null,
        refreshTrigger: false,
    });

    const { token } = useSessionStore();

    const { sendRequest, loading, data } = useAxiosRequest<{
        data: RewardHistoryItem[];
    }>();

    useEffect(() => {
        async function fetchRewardHistory() {
            try {
                const { result } = await sendRequest({
                    url: `api/v1/client/Points/points-history?pageNumber=${state.page}&pageSize=${limit}`,
                    method: 'GET',
                });
                const items = result?.data ?? [];
                if (items.length > 0) {
                    dispatch({ type: 'LIST', payload: items });
                } else if (state.page === 1) {
                    dispatch({ type: 'LIST', payload: [] });
                }
            } catch (err) {
                console.warn('fetchScans error', err);
            }
        }

        fetchRewardHistory();
    }, [state.page, state.refreshTrigger, sendRequest]);

    return { state, dispatch, loading, data };
}
