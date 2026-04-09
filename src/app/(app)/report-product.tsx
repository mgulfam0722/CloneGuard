import { Button, Input } from '@/components';
import colors from '@/constants/colors';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { Dimensions, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';

export default function ReportProduct() {
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375;
    const fontScale = Math.min(scaleFactor, 1.2);
    const router = useRouter();
    return (
        <KeyboardProvider>
            <ImageBackground
                source={require('assets/images/initial-background-image.png')}
                style={layout.fill}
            >
                <KeyboardAwareScrollView
                    style={{
                        elevation: 20,
                        backgroundColor: '#FEEDEC',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 100 * scaleFactor,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bottomOffset={Platform.select({ ios: 50, android: 100 })}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            paddingVertical: 15,
                            backgroundColor: '#7F241E',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersSemiBold,
                                color: colors.light.white,
                                fontSize: 30 * fontScale,
                                lineHeight: 43 * fontScale,
                                width: '70%',
                            }}
                        >
                            Report Suspecious Product
                        </Text>
                        <View>
                            <Entypo
                                name="circle-with-cross"
                                size={30}
                                color="#D36C64"
                                onPress={() => {
                                    router.back();
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            padding: 15 * scaleFactor,
                        }}
                    >
                        <Input
                            placeholderText="Product / Code"
                            title="Product / Code"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Input
                            title="Where did you buy it?"
                            placeholderText="Shop name or market"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Input
                            title="Location"
                            placeholderText="City or area"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Input
                            title="Additional notes"
                            placeholderText="Enter any additional information"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                            props={{
                                multiline: true,
                                numberOfLines: 3,
                            }}
                        />
                        <Input
                            title="Your contact information"
                            placeholderText="03xx-xxxxxxx"
                            titleStyle={{
                                color: colors.light.primaryDark,
                            }}
                        />
                        <Button
                            title="Submit report"
                            style={{
                                marginTop: 20 * scaleFactor,
                                backgroundColor: '#7F241E',
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
