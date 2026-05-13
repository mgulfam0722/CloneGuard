import { create } from 'zustand';

type LocationData = {
    latitude: number | null;
    longitude: number | null;
    locationName: string;
    timestamp: number | null; // Unix timestamp in ms
};

type LocationState = {
    location: LocationData;
    setLocation: (location: LocationData) => void;
    isLocationFresh: (maxAgeMs: number) => boolean;
};

export const useLocationStore = create<LocationState>((set, get) => ({
    location: {
        latitude: null,
        longitude: null,
        locationName: 'Unknown location',
        timestamp: null,
    },
    setLocation: (location) => set({ location }),
    isLocationFresh: (maxAgeMs) => {
        const { timestamp } = get().location;
        if (!timestamp) return false;
        return Date.now() - timestamp < maxAgeMs;
    },
}));
