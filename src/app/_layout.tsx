import { useSessionStore } from '@/stores';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const AUTH_PATHS = ['/login', '/create-account', '/otp', '/welcome'];

export default function RootLayout() {
    const { isAuthenticated, isLoading, restoreSession } = useSessionStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    // useEffect(() => {
    //     if (isLoading || !pathname) {
    //         return;
    //     }

    //     if (isAuthenticated) {
    //         if (
    //             !pathname.startsWith('/home') &&
    //             !pathname.startsWith('/history') &&
    //             !pathname.startsWith('/profile') &&
    //             pathname !== '/scan'
    //         ) {
    //             router.replace('/home');
    //         }
    //         return;
    //     }

    //     if (!AUTH_PATHS.includes(pathname)) {
    //         router.replace('/login');
    //     }
    // }, [isAuthenticated, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack>
                    <Stack.Protected guard={isAuthenticated}>
                        <Stack.Screen
                            name="(app)"
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Protected>

                    <Stack.Protected guard={!isAuthenticated}>
                        <Stack.Screen
                            name="(auth)"
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Protected>
                </Stack>
                <FlashMessage
                    position="top"
                    statusBarHeight={0}
                    floating
                    hideOnPress
                    duration={3000}
                    style={{
                        borderRadius: 12,
                        marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 3 : 8,
                        marginHorizontal: 12,
                        overflow: 'hidden',
                    }}
                    titleStyle={{ fontWeight: '700' }}
                    textStyle={{ fontSize: 13 }}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
