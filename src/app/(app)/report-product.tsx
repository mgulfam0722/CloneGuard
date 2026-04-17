import { Button, Input, PhoneInput } from '@/components';
import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks';
import { layout } from '@/styles/common';
import { fonts, typography } from '@/styles/typography';
import Entypo from '@expo/vector-icons/Entypo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';
import z from 'zod';

// Zod validation schema
const reportProductSchema = z.object({
    productName: z
        .string()
        .min(1, 'Product name is required')
        .min(2, 'Product name must be at least 2 characters')
        .max(50, 'Product name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Product name can only contain letters and spaces'),

    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .regex(
            /^(?:\+92|92|0)?3\d{9}$/,
            'Please enter a valid Pakistani phone number (03XXXXXXXXX or +923XXXXXXXXX)',
        ),

    location: z
        .string()
        .min(1, 'Location is required')
        .min(5, 'Location must be at least 10 characters'),

    whereDidYouBuyIt: z
        .string()
        .min(1, 'This field is required')
        .min(5, 'This field must be at least 10 characters')
        .max(200, 'This field must be less than 200 characters'),

    notes: z
        .string()
        .min(1, 'This field is required')
        .min(2, 'This field must be at least 2 characters')
        .max(50, 'This field must be less than 50 characters'),
});

type ReportProductFormData = z.infer<typeof reportProductSchema>;

export default function ReportProduct() {
    const { width, height } = Dimensions.get('window');
    const scaleFactor = width / 375;
    const fontScale = Math.min(scaleFactor, 1.2);
    const router = useRouter();
    const { verificationLogId, locationName } = useLocalSearchParams<{
        verificationLogId: string;
        locationName: string;
    }>();
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ReportProductFormData>({
        resolver: zodResolver(reportProductSchema),
        mode: 'onChange',
        defaultValues: {
            productName: '',
            phoneNumber: '',
            whereDidYouBuyIt: '',
            location: locationName ?? '',
            notes: '',
        },
    });

    const { sendRequest, loading } = useAxiosRequest();
    const onSubmit = useCallback(
        async (data: ReportProductFormData) => {
            const { result } = await sendRequest({
                url: 'api/v1/client/report/add-report',
                method: 'POST',
                data: {
                    producName: data.productName,
                    verificationLogId,
                    additionalNote: data.notes,
                    contact: data.phoneNumber,
                    wheredidyoubuyit: data.whereDidYouBuyIt,
                },
            });
            console.log('result: ', result);
            showMessage({
                type: 'info',
                message: 'Report submitted.',
            });
            router.replace('/home');
        },
        [verificationLogId],
    );
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
                        <Controller
                            control={control}
                            name="productName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholderText="Product Name"
                                    title="Product Name"
                                    titleStyle={{
                                        color: colors.light.primaryDark,
                                    }}
                                    props={{
                                        onChangeText: onChange,
                                        value: value,
                                    }}
                                />
                            )}
                        />
                        {errors.productName && (
                            <Text style={styles.errorText}>{errors.productName.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="whereDidYouBuyIt"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    title="Where did you buy it?"
                                    placeholderText="Shop name or market"
                                    titleStyle={{
                                        color: colors.light.primaryDark,
                                    }}
                                    props={{
                                        onChangeText: onChange,
                                        value: value,
                                    }}
                                />
                            )}
                        />
                        {errors.whereDidYouBuyIt && (
                            <Text style={styles.errorText}>{errors.whereDidYouBuyIt.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="location"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    title="Location"
                                    placeholderText="City or area"
                                    titleStyle={{
                                        color: colors.light.primaryDark,
                                    }}
                                    props={{
                                        onChangeText: onChange,
                                        value: value,
                                    }}
                                />
                            )}
                        />
                        {errors.location && (
                            <Text style={styles.errorText}>{errors.location.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="notes"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    title="Additional notes"
                                    placeholderText="Anything else you'd like to tell?"
                                    titleStyle={{
                                        color: colors.light.primaryDark,
                                    }}
                                    props={{
                                        onChangeText: onChange,
                                        value: value,
                                        multiline: true,
                                    }}
                                />
                            )}
                        />
                        {errors.notes && (
                            <Text style={styles.errorText}>{errors.notes.message}</Text>
                        )}

                        <Text style={[styles.titleText]}>Phone Number</Text>
                        <Controller
                            control={control}
                            name="phoneNumber"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PhoneInput value={value} onChangeText={onChange} />
                            )}
                        />
                        {errors.phoneNumber && (
                            <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
                        )}
                        {loading ? (
                            <ActivityIndicator
                                style={{
                                    marginTop: 20 * scaleFactor,
                                }}
                            />
                        ) : (
                            <Button
                                title="Submit report"
                                style={{
                                    marginTop: 20 * scaleFactor,
                                    backgroundColor: '#7F241E',
                                }}
                                onPressCallback={handleSubmit(onSubmit)}
                            />
                        )}
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
    titleText: {
        ...typography.body,
        color: colors.light.primaryDark,
        paddingLeft: 16,
        marginVertical: 10,
        fontWeight: '400',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        fontFamily: fonts.TeachersRegular,
        marginTop: 5,
        marginLeft: 16,
        marginBottom: 10,
    },
});
