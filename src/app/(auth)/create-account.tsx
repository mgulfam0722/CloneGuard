import { Button, Checkbox, Header, Input, PhoneInput, Select } from '@/components';
import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks/useAxiosRequest';
import { layout } from '@/styles/common';
import { fonts, typography } from '@/styles/typography';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';
import { z } from 'zod';

// Zod validation schema
const createAccountSchema = z
    .object({
        fullName: z
            .string()
            .min(1, 'Full name is required')
            .min(2, 'Full name must be at least 2 characters')
            .max(50, 'Full name must be less than 50 characters')
            .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),

        phoneNumber: z
            .string()
            .min(1, 'Phone number is required')
            .regex(
                /^(?:\+92|92|0)?3\d{9}$/,
                'Please enter a valid Pakistani phone number (03XXXXXXXXX or +923XXXXXXXXX)',
            ),

        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email address')
            .max(100, 'Email must be less than 100 characters'),

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

        address: z
            .string()
            .min(1, 'Address is required')
            .min(10, 'Address must be at least 10 characters')
            .max(200, 'Address must be less than 200 characters'),

        city: z
            .string()
            .min(1, 'City is required')
            .min(2, 'City must be at least 2 characters')
            .max(50, 'City must be less than 50 characters')
            .regex(/^[a-zA-Z\s]+$/, 'City can only contain letters and spaces'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

type SignupResponse = {
    token?: string;
    user?: any;
    // Add other response fields as needed
};

export default function CreateAccount() {
    const [isChecked, setIsChecked] = useState(false);
    const router = useRouter();

    const { sendRequest, loading } = useAxiosRequest<
        SignupResponse,
        {
            FullName: string;
            Email: string;
            PhoneNumber: string;
            Password: string;
            Address: string;
            City: string;
        }
    >();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            city: '',
        },
    });

    const onSubmit = async (data: CreateAccountFormData) => {
        if (!isChecked) {
            showMessage({
                type: 'danger',
                message: 'Please accept our terms and conditions.',
            });
            return;
        }

        try {
            const response = await sendRequest({
                method: 'POST',
                url: '/api/v1/client/Auth/signup',
                data: {
                    FullName: data.fullName,
                    Email: data.email,
                    PhoneNumber: data.phoneNumber,
                    Password: data.password,
                    Address: data.address,
                    City: data.city,
                },
            });

            if (response.status) {
                // Navigate to OTP screen for verification
                // Don't call signIn here - wait for OTP verification
                router.navigate({
                    pathname: '/otp',
                    params: { email: data.email },
                });
            }
        } catch (error) {
            console.error('Signup failed:', error);
            // Error handling is already done in the useAxiosRequest hook
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPasswordVsible, setConfirmPasswordVisible] = useState(true);
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

    return (
        <KeyboardProvider>
            <View
                style={[
                    layout.fill,
                    {
                        backgroundColor: colors.light.primaryDark,
                    },
                ]}
            >
                <Header />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontFamily: fonts.TeachersSemiBold,
                                color: colors.light.white,
                                fontSize: 48,
                                lineHeight: 45,
                                letterSpacing: -3,
                            }}
                        >
                            Create {'\n'}Account
                        </Text>
                    </View>
                    <View>
                        <View
                            style={{
                                borderWidth: 5,
                                borderColor: colors.light.secondaryColor,
                                width: 76,
                                height: 76,
                                borderRadius: 38,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="person" size={40} color={colors.light.secondaryColor} />
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        padding: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#11454C',
                        marginHorizontal: 15,
                        borderWidth: 1,
                        borderColor: '#32AB45',
                        marginTop: 20,
                        borderRadius: 15,
                        flexDirection: 'row',
                        marginBottom: 15,
                    }}
                >
                    <Feather
                        name="star"
                        size={20}
                        color={colors.light.white}
                        style={{
                            alignSelf: 'flex-start',
                        }}
                    />
                    <Text
                        style={{
                            textAlign: 'center',
                            color: colors.light.white,
                            fontFamily: fonts.TeachersRegular,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.light.white,
                                fontFamily: fonts.TeachersSemiBold,
                            }}
                        >
                            You'll earn 100pts instantly on account creation
                        </Text>{' '}
                        - redeemable for rewards.
                    </Text>
                </View>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    bottomOffset={Platform.select({ ios: 50, android: 100 })}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    title="Full Name"
                                    placeholderText="Enter your full name"
                                    props={{
                                        autoCapitalize: 'words',
                                        value,
                                        onChangeText: onChange,
                                        onBlur: onBlur,
                                        importantForAutofill: 'no',
                                    }}
                                />
                            )}
                        />
                        {errors.fullName && (
                            <Text style={styles.errorText}>{errors.fullName.message}</Text>
                        )}

                        {/* <Input
                            title="Phone Number"
                            placeholderText="Enter your phone number"
                            props={{
                                keyboardType: 'phone-pad',
                            }}
                        /> */}
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
                                        importantForAutofill: 'no',
                                        autoComplete: 'username-new',
                                    }}
                                />
                            )}
                        />
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email.message}</Text>
                        )}

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
                                        importantForAutofill: 'no',
                                        autoComplete: 'password-new',
                                    }}
                                    icon={passwordIcon}
                                />
                            )}
                        />
                        {errors.password && (
                            <Text style={styles.errorText}>{errors.password.message}</Text>
                        )}

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
                                        importantForAutofill: 'no',
                                        autoComplete: 'password-new',
                                    }}
                                    icon={confirmPasswordIcon}
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    title="Address"
                                    placeholderText="Enter your address"
                                    props={{
                                        autoCapitalize: 'sentences',
                                        value,
                                        onChangeText: onChange,
                                        onBlur: onBlur,
                                    }}
                                />
                            )}
                        />
                        {errors.address && (
                            <Text style={styles.errorText}>{errors.address.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Select
                                    title="City"
                                    placeholderText="Select city"
                                    options={[
                                        { title: 'Abbottabad' },
                                        { title: 'Ahmadpur East' },
                                        { title: 'Arifwala' },
                                        { title: 'Attock' },
                                        { title: 'Badin' },
                                        { title: 'Bahawalnagar' },
                                        { title: 'Bahawalpur' },
                                        { title: 'Bannu' },
                                        { title: 'Bhakkar' },
                                        { title: 'Bhalwal' },
                                        { title: 'Bhimber' },
                                        { title: 'Burewala' },
                                        { title: 'Chakwal' },
                                        { title: 'Charsadda' },
                                        { title: 'Chiniot' },
                                        { title: 'Chishtian' },
                                        { title: 'Dadu' },
                                        { title: 'Daska' },
                                        { title: 'Dera Ghazi Khan' },
                                        { title: 'Dera Ismail Khan' },
                                        { title: 'Faisalabad' },
                                        { title: 'Ghotki' },
                                        { title: 'Gojra' },
                                        { title: 'Gujranwala' },
                                        { title: 'Gujrat' },
                                        { title: 'Gwadar' },
                                        { title: 'Hafizabad' },
                                        { title: 'Hyderabad' },
                                        { title: 'Islamabad' },
                                        { title: 'Jacobabad' },
                                        { title: 'Jaranwala' },
                                        { title: 'Jhang' },
                                        { title: 'Jhelum' },
                                        { title: 'Kamoke' },
                                        { title: 'Karachi' },
                                        { title: 'Kasur' },
                                        { title: 'Khairpur' },
                                        { title: 'Khanewal' },
                                        { title: 'Khanpur' },
                                        { title: 'Khuzdar' },
                                        { title: 'Kohat' },
                                        { title: 'Kot Addu' },
                                        { title: 'Lahore' },
                                        { title: 'Larkana' },
                                        { title: 'Layyah' },
                                        { title: 'Lodhran' },
                                        { title: 'Mandi Bahauddin' },
                                        { title: 'Mansehra' },
                                        { title: 'Mardan' },
                                        { title: 'Matiari' },
                                        { title: 'Mianwali' },
                                        { title: 'Mirpur (AJK)' },
                                        { title: 'Mirpur Khas' },
                                        { title: 'Multan' },
                                        { title: 'Muzaffargarh' },
                                        { title: 'Muzaffarabad' },
                                        { title: 'Nankana Sahib' },
                                        { title: 'Nawabshah' },
                                        { title: 'Nowshera' },
                                        { title: 'Okara' },
                                        { title: 'Pakpattan' },
                                        { title: 'Peshawar' },
                                        { title: 'Quetta' },
                                        { title: 'Rahim Yar Khan' },
                                        { title: 'Rawalpindi' },
                                        { title: 'Sadiqabad' },
                                        { title: 'Sahiwal' },
                                        { title: 'Sambrial' },
                                        { title: 'Sargodha' },
                                        { title: 'Shahdadkot' },
                                        { title: 'Sheikhupura' },
                                        { title: 'Shikarpur' },
                                        { title: 'Sialkot' },
                                        { title: 'Sibi' },
                                        { title: 'Skardu' },
                                        { title: 'Sukkur' },
                                        { title: 'Swabi' },
                                        { title: 'Swat' },
                                        { title: 'Tando Adam' },
                                        { title: 'Tando Allahyar' },
                                        { title: 'Turbat' },
                                        { title: 'Umerkot' },
                                        { title: 'Vehari' },
                                        { title: 'Wah Cantonment' },
                                        { title: 'Zhob' },
                                    ]}
                                    value={value}
                                    onChange={(option) => onChange(option?.title || '')}
                                />
                            )}
                        />
                        {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}

                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                value={isChecked}
                                onValueChange={(value) => setIsChecked(value as boolean)}
                            />
                            <Text
                                style={[
                                    typography.body,
                                    {
                                        paddingHorizontal: 20,
                                        color: '#9E9E9E',
                                        fontFamily: fonts.TeachersRegular,
                                        fontSize: 12,
                                    },
                                ]}
                            >
                                I accept the terms and legally binding agreements and privacy policy
                            </Text>
                        </View>

                        {loading ? (
                            <ActivityIndicator
                                style={{
                                    margin: 15,
                                }}
                                size={'large'}
                                color={colors.light.white}
                            />
                        ) : (
                            <Button
                                title={'Create Account'}
                                style={{
                                    paddingHorizontal: 15,
                                    marginTop: 30,
                                }}
                                onPressCallback={handleSubmit(onSubmit)}
                            />
                        )}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </KeyboardProvider>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    titleText: {
        ...typography.body,
        color: colors.light.white,
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
    eyeIconContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
