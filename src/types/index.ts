export enum ScanItemState {
    All = 'all',
    Genuine = 'genuine',
    fake = 'fake',
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
