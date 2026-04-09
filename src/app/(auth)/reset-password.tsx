import { Button, Header, Input } from '@/components';
import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import z from 'zod';

// Zod validation schema
const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be less than 50 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            ),

        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVsible, setConfirmPasswordVisible] = useState(false);
    const passwordIcon = useMemo(
        () => (
            <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setPasswordVisible((v) => !v)}
            >
                <Ionicons
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={20}
                    color={colors.light.secondaryColor}
                />
            </TouchableOpacity>
        ),
        [passwordVisible],
    );

    const confirmPasswordIcon = useMemo(
        () => (
            <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setConfirmPasswordVisible((v) => !v)}
            >
                <Ionicons
                    name={confirmPasswordVsible ? 'eye' : 'eye-off'}
                    size={20}
                    color={colors.light.secondaryColor}
                />
            </TouchableOpacity>
        ),
        [confirmPasswordVsible],
    );

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });
    const { email } = useLocalSearchParams<{ email: string }>();
    const resetToken = useSessionStore((store) => store.resetToken);
    const clearResetToken = useSessionStore((store) => store.clearResetToken);
    const { sendRequest, loading } = useAxiosRequest<
        {},
        {
            email: string;
            resetToken: string;
            newPassword: string;
        }
    >();
    const router = useRouter();
    const onSubmit = useCallback(
        async (data: ResetPasswordFormData) => {
            if (!resetToken) {
                showMessage({
                    type: 'danger',
                    message: 'Somethign went wrong!',
                });
                return;
            }
            const {} = await sendRequest({
                url: 'api/v1/client/Auth/reset-password',
                method: 'POST',
                data: {
                    email,
                    resetToken,
                    newPassword: data.password,
                },
            });
            router.replace('/login');
        },
        [router],
    );
    return (
        <View style={layout.fill}>
            <Header />
            <Text
                style={{
                    fontFamily: fonts.TeachersBold,
                    fontSize: 40,
                    color: colors.light.white,
                    marginVertical: 10,
                }}
            >
                Forgot{'\n'}Password
            </Text>
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        title="Password"
                        placeholderText="Create a password"
                        isPassword={true}
                        isPasswordHidden={passwordVisible}
                        props={{
                            autoCapitalize: 'none',
                            value,
                            onChangeText: onChange,
                            onBlur: onBlur,
                            secureTextEntry: passwordVisible,
                        }}
                        icon={passwordIcon}
                    />
                )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        isPassword={true}
                        title="Confirm Password"
                        placeholderText="Re-enter your password"
                        isPasswordHidden={confirmPasswordVsible}
                        props={{
                            autoCapitalize: 'none',
                            value,
                            onChangeText: onChange,
                            onBlur: onBlur,
                            secureTextEntry: confirmPasswordVsible,
                        }}
                        icon={confirmPasswordIcon}
                    />
                )}
            />
            {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
            )}
            {loading ? (
                <ActivityIndicator
                    style={{
                        marginTop: 20,
                    }}
                />
            ) : (
                <Button
                    title="Submit"
                    style={{
                        marginTop: 20,
                    }}
                    onPressCallback={handleSubmit(onSubmit)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    eyeIconContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 15,
        fontFamily: fonts.TeachersRegular,
        marginTop: 5,
        marginLeft: 16,
        marginBottom: 10,
    },
});
