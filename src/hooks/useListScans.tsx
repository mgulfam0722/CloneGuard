import { ScanItem, ScanItemState } from '@/types';
import { useCallback, useState } from 'react';
import { usePaginatedList } from './usePaginatedList';

export function useListScans(status: ScanItemState = ScanItemState.All, limit = 10) {
    const [currentStatus, setCurrentStatus] = useState(status);

    const fetchUrl = useCallback(
        (page: number, pageSize: number) => {
            let url = `api/v1/client/Product/scan-history?pageNumber=${page}&pageSize=${pageSize}`;
            if (currentStatus === ScanItemState.Genuine) {
                url += '&isGenuine=true';
            } else if (currentStatus === ScanItemState.Fake) {
                url += '&isGenuine=false';
            }
            return url;
        },
        [currentStatus],
    );

    const { state, dispatch, loading, data } = usePaginatedList<ScanItem>(fetchUrl, { limit });

    const handleStatusChange = (newStatus: ScanItemState) => {
        setCurrentStatus(newStatus);
        // Reset pagination when status changes
        dispatch({ type: 'REFRESH' });
    };

    return { state, dispatch, loading, data, status: currentStatus, setStatus: handleStatusChange };
}
