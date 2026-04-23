import { Stack } from 'expo-router';

// Set the animation options. This is optional.
// SplashScreen.setOptions({
//     duration: 1000,
//     fade: true,
// });

export default function RootLayout() {
    return (
        <Stack
            initialRouteName="welcome"
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}
