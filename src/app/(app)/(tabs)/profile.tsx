import { Button, Input, Select } from '@/components';
import colors from '@/constants/colors';
import { StrictAxiosConfig, useAxiosOnMount, useAxiosRequest } from '@/hooks';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';
import z from 'zod';

const createAccountSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(50, 'Full name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),

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
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export default function Profile() {
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375;
    const fontScale = Math.min(scaleFactor, 1.2);
    const signOut = useSessionStore((store) => store.signOut);
    const reqConfig = useCallback((): StrictAxiosConfig<{}> => {
        return {
            url: 'api/v1/client/Customer/get-profile',
            method: 'GET',
        };
    }, []);
    const { data, refetch, loading } = useAxiosOnMount<{
        fullName: string;
        email: string;
        phoneNumber: string;
        password: null;
        address: string;
        city: string;
    }>(reqConfig);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        mode: 'onChange',
        defaultValues: {
            fullName: data?.fullName || '',
            address: data?.address || '',
            city: data?.city || '',
        },
    });

    useEffect(() => {
        if (!data) return;

        reset({
            fullName: data.fullName ?? '',
            address: data.address ?? '',
            city: data.city ?? '',
        });
    }, [data, reset]);

    const { sendRequest, loading: submitLoading } = useAxiosRequest<
        {},
        {
            FullName: string;
            Address: string;
            City: string;
        }
    >();

    const setFullName = useSessionStore((store) => store.setFullName);
    const onSubmit = async (data: CreateAccountFormData) => {
        try {
            await sendRequest({
                method: 'PUT',
                url: 'api/v1/client/Customer/update-profile',
                data: {
                    FullName: data.fullName,
                    Address: data.address,
                    City: data.city,
                },
            });
            await AsyncStorage.setItem('fullName', data.fullName);
            setFullName(data.fullName);
            refetch();
        } catch (error) {
            console.error('Signup failed:', error);
            // Error handling is already done in the useAxiosRequest hook
        }
    };
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
                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <View
                            style={{
                                padding: 15 * scaleFactor,
                            }}
                        >
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
                                        }}
                                        titleStyle={{
                                            color: colors.light.primaryDark,
                                        }}
                                    />
                                )}
                            />
                            {errors.fullName && (
                                <Text style={styles.errorText}>{errors.fullName.message}</Text>
                            )}
                            <Input
                                title="Phone Number"
                                placeholderText="03xx-xxxxxxx"
                                titleStyle={{
                                    color: colors.light.primaryDark,
                                }}
                                props={{
                                    value: data?.phoneNumber,
                                    editable: false,
                                }}
                            />
                            <Input
                                title="Email"
                                placeholderText="Email"
                                titleStyle={{
                                    color: colors.light.primaryDark,
                                }}
                                props={{
                                    value: data?.email,
                                    editable: false,
                                }}
                            />
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
                                        titleStyle={{
                                            color: colors.light.primaryDark,
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
                                        titleStyle={{
                                            color: colors.light.primaryDark,
                                        }}
                                    />
                                )}
                            />
                            {errors.city && (
                                <Text style={styles.errorText}>{errors.city.message}</Text>
                            )}
                            {submitLoading ? (
                                <ActivityIndicator
                                    style={{
                                        marginTop: 15,
                                    }}
                                />
                            ) : (
                                <Button
                                    title="Submit"
                                    style={{
                                        marginTop: 20 * scaleFactor,
                                        backgroundColor: colors.light.primaryDark,
                                    }}
                                    onPressCallback={handleSubmit(onSubmit)}
                                />
                            )}
                            <Button
                                title="Log Out"
                                style={{
                                    backgroundColor: '#7F241E',
                                    marginTop: 20,
                                }}
                                onPressCallback={() => {
                                    // signOut();
                                    Alert.alert(
                                        'Confirm Logout',
                                        'Are you sure you want to log out?',
                                        [{ text: 'No' }, { text: 'Yes', onPress: () => signOut() }],
                                    );
                                }}
                            />
                        </View>
                    )}
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
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        fontFamily: fonts.TeachersRegular,
        marginTop: 5,
        marginLeft: 16,
        marginBottom: 10,
    },
});
