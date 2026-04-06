import { Stack } from 'expo-router';

export default function Homelayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}
