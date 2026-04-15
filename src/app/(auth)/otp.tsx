import { Button, Header } from '@/components';
import colors from '@/constants/colors';
import { useCountDown } from '@/hooks';
import { useAxiosRequest } from '@/hooks/useAxiosRequest';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts, typography } from '@/styles/typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

export default function OTP() {
    const [isResendCodeButtonVisible, setResendCodeButtonVisible] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(20);
    const [otp, setOTP] = useState('');
    const router = useRouter();
    const { email, flow = 'signup' } = useLocalSearchParams<{ email: string; flow?: string }>();
    console.log('flow: ', flow);
    const { sendRequest, loading } = useAxiosRequest<
        {
            accessToken: string | null;
            resetToken: string | null;
            fullName: string;
            role: string;
        },
        {
            Email: string;
            OtpCode: string;
        }
    >();

    useCountDown({
        seconds: secondsLeft,
        setSeconds: setSecondsLeft,
        onFinishCallback: () => {
            setResendCodeButtonVisible(true);
        },
    });
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    const setResetToken = useSessionStore((store) => store.setResetToken);

    const { sendRequest: sendOTPReq, loading: sendOTPLoading } = useAxiosRequest();

    const resendOTP = useCallback(async () => {
        const { message, status } = await sendOTPReq({
            method: 'POST',
            url: '/api/v1/client/Auth/forgot-password',
            data: {
                email,
            },
        });
        setSecondsLeft(20);
        setResendCodeButtonVisible(false);
    }, [email]);

    return (
        <View style={layout.fill}>
            <Header />
            <View style={layout.mt25}>
                <Text
                    style={[
                        typography.subheading,
                        { color: colors.light.white, textAlign: 'center' },
                    ]}
                >
                    Enter code
                </Text>
                <Text
                    style={[
                        typography.body,
                        {
                            textAlign: 'center',
                            marginVertical: 30,
                            color: colors.light.white,
                            fontFamily: fonts.TeachersRegular,
                        },
                    ]}
                >
                    We’ve sent an SMS with an activation code to your mobile number +971
                    {'564654654'}
                </Text>
            </View>
            <View>
                <OtpInput
                    onTextChange={setOTP}
                    theme={{
                        pinCodeContainerStyle: {
                            borderColor: colors.light.gray800,
                            borderWidth: 1,
                            backgroundColor: colors.light.white,
                            width: 55,
                            borderRadius: 15,
                        },
                        focusedPinCodeContainerStyle: {
                            borderColor: colors.light.secondaryColor,
                        },
                        focusStickStyle: {
                            backgroundColor: 'white',
                        },
                        pinCodeTextStyle: {
                            color: 'black',
                        },
                    }}
                />
            </View>
            {isResendCodeButtonVisible ? (
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>I didn’t receive a code. </Text>
                    <TouchableOpacity onPress={resendOTP}>
                        <Text style={styles.timer}>Resend</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>Send a code again in </Text>
                    <Text style={styles.timer}>{minutes}</Text>
                    <Text style={styles.timer}>:</Text>
                    <Text style={styles.timer}>{seconds}</Text>
                </View>
            )}
            <View style={layout.buttonContainer}>
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Button
                        title="Verify"
                        onPressCallback={async () => {
                            if (otp.length === 6) {
                                try {
                                    const response = await sendRequest({
                                        method: 'POST',
                                        url: '/api/v1/client/Auth/verify-otp',
                                        data: {
                                            Email: email || '',
                                            OtpCode: otp,
                                        },
                                    });

                                    if (response.status) {
                                        if (flow !== 'signup' && response.result.resetToken) {
                                            setResetToken(response.result.resetToken);
                                            // router.replace('/reset-password');
                                            router.navigate({
                                                pathname: '/reset-password',
                                                params: { email, flow: 'forgot-password' },
                                            });
                                        } else {
                                            router.replace('/login');
                                        }
                                    }
                                } catch (error) {
                                    console.error('OTP verification failed:', error);
                                }
                            }
                        }}
                        props={{
                            disabled: otp.length !== 6 || loading,
                        }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 10,
        marginTop: 10,
    },
    flagImage: {
        width: 23,
        height: 17,
        resizeMode: 'contain',
        marginRight: 20,
    },
    line: {
        height: 26,
        marginHorizontal: 11,
        borderWidth: 0.7,
        borderColor: colors.light.gray600,
    },
    inputStyle: {
        ...typography.body,
        flex: 1,
        paddingVertical: 0,
        textAlignVertical: 'center',
        marginVertical: 0,
        width: 250,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    timerText: {
        ...typography.body,
        color: colors.light.white,
        fontFamily: fonts.TeachersRegular,
    },
    timer: {
        ...typography.body,
        color: colors.light.secondaryColor,
        fontFamily: fonts.TeachersRegular,
    },
});
