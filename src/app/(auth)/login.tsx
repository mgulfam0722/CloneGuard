import { Button, Input } from '@/components';
import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks/useAxiosRequest';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts, typography } from '@/styles/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';
import { z } from 'zod';

type LoginFields = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    // const { sendRequest, loading } = useAxiosRequest<{
    //     accessToken: string;
    //     success: boolean;
    //     fullname: string;
    // }>();
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const router = useRouter();
    const { signIn } = useSessionStore();
    const { sendRequest, loading } = useAxiosRequest<
        {
            accessToken?: string;
            email: string;
            fullName: string;
        },
        {
            Email: string;
            PhoneNumber: string;
            Password: string;
        }
    >();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFields>({
        resolver: zodResolver(
            z.object({
                email: z.email('Enter a valid email'),
                password: z.string().min(1, 'Password is required!'),
            }),
        ),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const passwordInputProps = useMemo(
        () => ({
            autoCapitalize: 'none' as 'none' | 'sentences' | 'words' | 'characters' | undefined,
            autoCorrect: false,
            secureTextEntry: isPasswordHidden,
        }),
        [isPasswordHidden],
    );

    const passwordIcon = useMemo(
        () => (
            <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setIsPasswordHidden((v) => !v)}
            >
                <Ionicons
                    name={isPasswordHidden ? 'eye' : 'eye-off'}
                    size={20}
                    color={colors.light.secondaryColor}
                />
            </TouchableOpacity>
        ),
        [isPasswordHidden],
    );

    const onSubmit = async (data: LoginFields) => {
        try {
            const response = await sendRequest({
                method: 'POST',
                url: '/api/v1/client/Auth/login',
                data: {
                    Email: data.email,
                    PhoneNumber: '',
                    Password: data.password,
                },
            });
            if (response.status && response.result?.accessToken) {
                await signIn(response.result.accessToken, response.result.fullName || '');
                router.replace('/home');
            }
        } catch (e) {
            console.error('Login error:', e);
        }
    };

    return (
        <KeyboardProvider>
            <ImageBackground style={layout.fill}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    bottomOffset={Platform.select({ ios: 80, android: 100 })}
                >
                    <View>
                        <View
                            style={{
                                marginBottom: 40,
                            }}
                        >
                            <Text
                                style={[
                                    typography.h1,
                                    styles.title,
                                    {
                                        letterSpacing: -3,
                                    },
                                ]}
                            >
                                Welcome back
                            </Text>
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14,
                                    color: colors.light.gray50,
                                    textAlign: 'center',
                                    marginTop: 10,
                                }}
                            >
                                Sign in to save history and report counterfeit items
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <Input
                                    title="Email"
                                    placeholderText="Enter your email"
                                    props={{
                                        value: field.value,
                                        onChangeText: field.onChange,
                                        onBlur: field.onBlur,
                                        keyboardType: 'email-address',
                                        autoCapitalize: 'none',
                                        // style: {
                                        //     color: colors.light.gray600,
                                        //     marginVertical: 0,
                                        //     fontFamily: fonts.TeachersRegular,
                                        //     fontSize: 17,
                                        // },
                                    }}
                                />
                            )}
                        />
                        {errors.email && (
                            <Text style={typography.error}>{errors.email.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <Input
                                    placeholderText="Password"
                                    containerStyle={styles.passwordContainer}
                                    isPasswordHidden={isPasswordHidden}
                                    props={{
                                        value: field.value,
                                        onChangeText: field.onChange,
                                        ...passwordInputProps,
                                        style: {
                                            color: colors.light.gray600,
                                            marginVertical: 0,
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 17,
                                        },
                                    }}
                                    icon={passwordIcon}
                                />
                            )}
                        />
                        {errors.password && (
                            <Text style={typography.error}>{errors.password.message}</Text>
                        )}

                        <TouchableOpacity onPress={() => {}}>
                            <Text
                                style={[
                                    typography.body,
                                    {
                                        color: colors.light.white,
                                        textAlign: 'left',
                                        marginBottom: 25,
                                        fontFamily: fonts.TeachersRegular,
                                        fontSize: 14,
                                        marginTop: 8,
                                        marginLeft: 10,
                                    },
                                ]}
                            >
                                Forgot password?
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.buttonWrapper}>
                            {loading ? (
                                <ActivityIndicator color={colors.light.white} />
                            ) : (
                                <Button title="Log in" onPressCallback={handleSubmit(onSubmit)} />
                            )}
                        </View>

                        <Button
                            title="Continue as Guest"
                            style={{
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 30,
                                backgroundColor: undefined,
                                paddingHorizontal: 10,
                                borderWidth: 1,
                                borderColor: colors.light.white,
                                marginTop: 20,
                            }}
                        />

                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                fontSize: 12,
                                color: colors.light.white,
                                textAlign: 'center',
                                marginTop: 25,
                                paddingHorizontal: 50,
                            }}
                        >
                            Guest mode allows scanning & verification. History saved locally on your
                            device only.
                        </Text>

                        <View
                            style={[
                                layout.center,
                                layout.mt25,
                                layout.flexRow,
                                {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14,
                                    color: colors.light.white,
                                }}
                            >
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    router.navigate('/create-account');
                                }}
                            >
                                <Text
                                    style={{
                                        textDecorationLine: 'underline',
                                        color: colors.light.secondaryColor,
                                        fontFamily: fonts.TeachersRegular,
                                        fontSize: 14,
                                    }}
                                >
                                    Sign up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </KeyboardProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        color: colors.light.gray50,
        // marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        marginTop: 8,
    },
    passwordContainer: {
        marginTop: 20,
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotContainer: {
        alignItems: 'flex-end',
        paddingVertical: 8,
    },
    buttonWrapper: {
        marginTop: 10,
    },
});
