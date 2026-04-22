export enum ScanItemState {
    All = 'all',
    Genuine = 'genuine',
    Fake = 'fake',
}

export type ScanItem = {
    id: string;
    isGenuine: boolean;
    scannedValue: string;
    productName: string;
    tenantName: string;
    verifiedAt: string;
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
};

export type ScanReducerState = {
    page: number;
    status: ScanItemState;
    scans: ScanItem[] | null;
    refreshTrigger: boolean;
};

export type ScanActionPayload =
    | { type: 'PAGE'; payload: number }
    | { type: 'STATUS'; payload: ScanItemState }
    | { type: 'REFRESH' }
    | { type: 'SCANS'; payload: ScanItem[] };
// | { type: 'REMOVE_BOOKING'; payload: string };

export type RewardHistoryItem = {
    id: string;
    productName: string;
    companyName: string;
    points: string;
    pointsType: string;
    transactionType: 'Added' | 'Withdraw';
};

export type RewardHistoryReducerState = {
    page: number;
    list: RewardHistoryItem[] | null;
    refreshTrigger: boolean;
};

export type RewardHistoryPayload =
    | { type: 'PAGE'; payload: number }
    | { type: 'REFRESH' }
    | { type: 'LIST'; payload: RewardHistoryItem[] };
