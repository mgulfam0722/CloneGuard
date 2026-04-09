import { Button, Header, Input } from '@/components';
import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import z from 'zod';

// Zod validation schema
const forgotPasswordSchema = z.object({
    email: z.email(),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const router = useRouter();
    const { sendRequest, loading } = useAxiosRequest();
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
        },
    });
    const onSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            const { status } = await sendRequest({
                url: 'api/v1/client/Auth/forgot-password',
                method: 'POST',
                data: {
                    email: data.email,
                },
            });
            // router.navigate('/otp?flow=forgot-password')
            router.navigate({
                pathname: '/otp',
                params: { email: data.email, flow: 'forgot-password' },
            });
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
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        title="Email"
                        placeholderText="Enter your email"
                        props={{
                            keyboardType: 'email-address',
                            autoCapitalize: 'none',
                            value,
                            onChangeText: onChange,
                            onBlur: onBlur,
                        }}
                    />
                )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
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
    errorText: {
        color: '#FF6B6B',
        fontSize: 15,
        fontFamily: fonts.TeachersRegular,
        marginTop: 5,
        marginLeft: 16,
        marginBottom: 10,
    },
});
