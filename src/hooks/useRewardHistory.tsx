import { RewardHistoryItem } from '@/types';
import { usePaginatedList } from './usePaginatedList';

export function useRewardHistory(limit = 10) {
    const fetchUrl = (page: number, pageSize: number) =>
        `api/v1/client/Points/points-history?pageNumber=${page}&pageSize=${pageSize}`;

    return usePaginatedList<RewardHistoryItem>(fetchUrl, { limit });
}
