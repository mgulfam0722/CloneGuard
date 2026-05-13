import { Wallet } from '@/types';
import { usePaginatedList } from './usePaginatedList';

export function useWalletList(limit = 10) {
    const fetchUrl = (page: number, pageSize: number) =>
        `api/v1/client/Points/tenant-wallets?pageNumber=${page}&pageSize=${pageSize}`;

    return usePaginatedList<Wallet>(fetchUrl, { limit });
}
