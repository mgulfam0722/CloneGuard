import { Stack } from 'expo-router';

// Create a new component that can access the SessionProvider context later.
export default function RootNavigator() {
    return <Stack screenOptions={{ headerShown: false }} />;
}
