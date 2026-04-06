import { Button } from '@/components';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { View } from 'react-native';

export default function Profile() {
    const signOut = useSessionStore((store) => store.signOut);
    return (
        <View style={layout.fillCenter}>
            <Button
                title="Logout"
                style={{
                    backgroundColor: '#7F241E',
                }}
                onPressCallback={() => {
                    signOut();
                }}
            />
        </View>
    );
}
