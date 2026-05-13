import { RedemptionHistoryItem } from '@/types';
import { usePaginatedList } from './usePaginatedList';

export function useRedemptionHistory(limit = 10) {
    const fetchUrl = (page: number, pageSize: number) =>
        `api/v1/client/Points/my-redemptions?pageNumber=${page}&pageSize=${pageSize}`;

    return usePaginatedList<RedemptionHistoryItem>(fetchUrl, { limit });
}
