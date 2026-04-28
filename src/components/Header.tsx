import { useNavigation } from '@react-navigation/native';
import { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

export function Header({
    onPressCallback,
    icon,
    disableBackNavigation = false,
}: {
    onPressCallback?: () => void;
    icon?: ReactNode;
    disableBackNavigation?: boolean;
}) {
    // const { isAuthenticated, isLoading } = useSession();
    const navigation = useNavigation();

    const handleBackPress = onPressCallback || navigation.goBack;

    if (!!false) {
        return (
            <View style={styles.container}>
                {!disableBackNavigation && (
                    <Pressable
                        onPress={handleBackPress}
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.6 : 1,
                            ...styles.pressableContainer,
                        })}
                        hitSlop={50}
                        testID="back-button"
                    >
                        <Image
                            source={require('#/assets/images/back-icon.png')}
                            resizeMode="contain"
                            testID="back-img"
                            tintColor={'white'}
                        />
                    </Pressable>
                )}
                <View>
                    {/* <Image
                        source={require('#/assets/images/logo.png')}
                        style={[
                            styles.logo,
                            {
                                alignSelf: 'flex-end',
                                marginBottom: 11,
                            },
                        ]}
                        testID="logo"
                        resizeMode="contain"
                        width={150}
                    /> */}
                </View>
                {icon}
            </View>
        );
    }

    return (
        <Pressable
            onPress={handleBackPress}
            style={styles.backPressable}
            hitSlop={50}
            testID="back-button"
        >
            <Image
                source={require('#/assets/images/back-icon.png')}
                resizeMode="contain"
                testID="back-img"
                tintColor={'white'}
                width={150}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pressableContainer: {
        width: 'auto',
        height: 'auto',
    },
    logo: {
        width: 70,
        height: 51,
    },
    backPressable: {
        width: 'auto',
        height: 'auto',
        alignSelf: 'flex-start',
        zIndex: 2,
        padding: 10,
    },
});
