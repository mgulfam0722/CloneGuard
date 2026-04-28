import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, ImageBackground, StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
    const { isAuthenticated, isLoading, restoreSession } = useSessionStore();

    const [loaded] = useFonts({
        'Sora-Bold': require('#/assets/fonts/Sora-Bold.ttf'),
        'Sora-SemiBold': require('#/assets/fonts/Sora-SemiBold.ttf'),
        'Teachers-Bold': require('#/assets/fonts/Teachers-Bold.ttf'),
        'Teachers-BoldItalic': require('#/assets/fonts/Teachers-BoldItalic.ttf'),
        'Teachers-ExtraBold': require('#/assets/fonts/Teachers-ExtraBold.ttf'),
        'Teachers-ExtraBoldItalic': require('#/assets/fonts/Teachers-ExtraBoldItalic.ttf'),
        'Teachers-Italic': require('#/assets/fonts/Teachers-Italic.ttf'),
        'Teachers-Medium': require('#/assets/fonts/Teachers-Medium.ttf'),
        'Teachers-MediumItalic': require('#/assets/fonts/Teachers-MediumItalic.ttf'),
        'Teachers-Regular': require('#/assets/fonts/Teachers-Regular.ttf'),
        'Teachers-SemiBold': require('#/assets/fonts/Teachers-SemiBold.ttf'),
        'Teachers-SemiBoldItalic': require('#/assets/fonts/Teachers-SemiBoldItalic.ttf'),
    });

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    if (isLoading || !loaded) {
        return (
            <ImageBackground
                source={require('assets/images/initial-background-image.png')}
                style={layout.fillCenter}
            >
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
                    <Stack.Screen
                        name="scan"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="product-detail"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack>
                <FlashMessage
                    position="top"
                    statusBarHeight={0}
                    floating
                    hideOnPress
                    duration={3000}
                    style={{
                        borderRadius: 12,
                        marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 3 : 80,
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
