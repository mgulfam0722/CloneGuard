import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, ImageBackground, StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const AUTH_PATHS = ['/login', '/create-account', '/otp', '/welcome'];

export default function RootLayout() {
    const { isAuthenticated, isLoading, restoreSession } = useSessionStore();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    if (isLoading) {
        return (
            <ImageBackground source={require('assets/images/initial-background-image.png')} style={layout.fillCenter}>
                <ActivityIndicator size={'large'} color={'white'} />
            </ImageBackground>
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
