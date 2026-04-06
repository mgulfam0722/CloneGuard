import colors from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.light.white,
                tabBarInactiveTintColor: colors.light.gray800,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Ionicons size={28} name="home-outline" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => (
                        <Ionicons size={28} name="time-outline" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="user-o" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 62,
        backgroundColor: colors.light.secondaryColor,
        borderRadius: 40,
        borderWidth: 0.56,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        paddingTop: 10,
        marginHorizontal: 80,
        // opacity: 0.99,
        // overflow: 'hidden',
        // borderBottomWidth: 0,
        // borderColor: 'rgba(255, 255, 255, 0.5)',
        // width: 178,
        // justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        elevation: 25,
    },
    iconActive: {
        backgroundColor: colors.light.secondaryColor,
        borderRadius: 25,
    },
});
