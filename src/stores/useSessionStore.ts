import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';

type SessionState = {
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    fullName: string;
    resetToken: string | null;
    restoreSession: () => Promise<void>;
    signIn: (token: string, fullName: string) => Promise<void>;
    signOut: () => Promise<void>;
    setResetToken: (token: string) => void;
    clearResetToken: () => void;
    setFullName: (fullName: string) => void;
};

const SESSION_DURATION = 24 * 60 * 60 * 7 * 1000; // 7 days in ms
let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export const useSessionStore = create<SessionState>((set, get) => ({
    token: null,
    isLoading: true,
    isAuthenticated: false,
    fullName: '',
    resetToken: null,

    restoreSession: async () => {
        try {
            if (!Keychain || typeof Keychain.getGenericPassword !== 'function') {
                console.warn('Keychain native module is unavailable. Session restore is disabled.');
                return;
            }

            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                const { password } = credentials;
                const parsed = JSON.parse(password);
                const storedToken = parsed.token;
                const storedFullName = await AsyncStorage.getItem('fullName');
                const storedTimestamp = new Date(parsed.timestamp);
                const now = new Date();
                const elapsed = now.getTime() - storedTimestamp.getTime();

                if (elapsed < SESSION_DURATION) {
                    set({
                        token: storedToken,
                        fullName: storedFullName || 'N/A',
                        isAuthenticated: true,
                    });

                    if (logoutTimer) clearTimeout(logoutTimer);

                    logoutTimer = setTimeout(() => {
                        get().signOut();
                        showMessage({
                            type: 'info',
                            message: 'Session expired. You have been logged out.',
                        });
                    }, SESSION_DURATION - elapsed);
                } else {
                    await get().signOut();
                }
            }
        } catch (err) {
            console.error('Failed to restore session:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    signIn: async (token: string, fullName: string) => {
        try {
            const payload = JSON.stringify({
                token,
                timestamp: new Date().toISOString(),
            });

            if (
                Platform.OS !== 'web' &&
                Keychain &&
                typeof Keychain.setGenericPassword === 'function'
            ) {
                await Keychain.setGenericPassword('auth', payload, {
                    accessible: Keychain.ACCESSIBLE?.WHEN_UNLOCKED_THIS_DEVICE_ONLY ?? undefined,
                });
            } else {
                console.warn('Keychain native module is unavailable. Token will not be persisted.');
            }

            set({
                token,
                fullName,
                isAuthenticated: true,
            });

            if (logoutTimer) clearTimeout(logoutTimer);

            logoutTimer = setTimeout(() => {
                get().signOut();
                showMessage({
                    type: 'info',
                    message: 'Session expired. You have been logged out.',
                });
            }, SESSION_DURATION);
        } catch (err) {
            console.error('SignIn error:', err);
            showMessage({
                type: 'danger',
                message: 'Failed to sign in. Please try again.',
            });
        }
    },

    signOut: async () => {
        if (logoutTimer) clearTimeout(logoutTimer);
        try {
            if (Keychain && typeof Keychain.resetGenericPassword === 'function') {
                await Keychain.resetGenericPassword();
            }
        } catch (err) {
            console.error('SignOut error:', err);
        }
        set({
            token: null,
            fullName: '',
            isAuthenticated: false,
        });
    },

    setResetToken: (token: string) =>
        set({
            resetToken: token,
        }),

    clearResetToken: () =>
        set({
            resetToken: null,
        }),

    setFullName: (fullName: string) =>
        set({
            fullName,
        }),
}));
