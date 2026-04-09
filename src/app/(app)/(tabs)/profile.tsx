import { Button, Input } from '@/components';
import colors from '@/constants/colors';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Alert, Dimensions, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';

export default function Profile() {
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375;
    const fontScale = Math.min(scaleFactor, 1.2);
    const signOut = useSessionStore((store) => store.signOut);
    return (
        <KeyboardProvider>
            <ImageBackground
                source={require('assets/images/initial-background-image.png')}
                style={layout.fill}
            >
                <KeyboardAwareScrollView
                    style={{
                        elevation: 20,
                        backgroundColor: colors.light.white,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 75 * scaleFactor,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bottomOffset={Platform.select({ ios: 50, android: 100 })}
                    // refreshControl={}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            marginTop: 30,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersSemiBold,
                                color: 'black',
                                fontSize: 30 * fontScale,
                                lineHeight: 43 * fontScale,
                                width: '70%',
                            }}
                        >
                            Profile
                        </Text>
                        <View>
                            <FontAwesome
                                name="user-o"
                                size={30}
                                color={colors.light.primaryColor}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            padding: 15 * scaleFactor,
                        }}
                    >
                        <Input
                            placeholderText="Full Name"
                            title="Full Name"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Input
                            title="Phone Number"
                            placeholderText="03xx-xxxxxxx"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Input
                            title="Email"
                            placeholderText="Email"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        {/* <Input
                            title="Additional notes"
                            placeholderText="Enter any additional information"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                            props={{
                                multiline: true,
                                numberOfLines: 3,
                            }}
                        /> */}
                        <Input
                            title="Address"
                            placeholderText="Sindh"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Input
                            title="City"
                            placeholderText="Karachi"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Button
                            title="Submit"
                            style={{
                                marginTop: 20 * scaleFactor,
                                backgroundColor: colors.light.primaryDark,
                            }}
                        />
                        <Button
                            title="Log Out"
                            style={{
                                backgroundColor: '#7F241E',
                                marginTop: 20,
                            }}
                            onPressCallback={() => {
                                // signOut();
                                Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
                                    { text: 'No' },
                                    { text: 'Yes', onPress: () => signOut() },
                                ]);
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </KeyboardProvider>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: colors.light.secondaryColor,
        paddingVertical: 5,
        marginVertical: 2,
    },
});
