import { Button } from '@/components';
import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks';
import { layout } from '@/styles/common';
import { fonts, typography } from '@/styles/typography';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { Mask, Rect } from 'react-native-svg';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Hide tab bar on this screen
export const unstable_settings = {
    tabBarStyle: { display: 'none' },
};

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const { sendRequest, loading: reqLoading } = useAxiosRequest<
        {
            isGenuine: Boolean;
            message: string;
            productName: string;
            sku: string;
            category: string;
            batchNumber: number;
            manufacturingDate: string;
            expiryDate: string;
            tenantName: string;
            verificationCount: number;
        },
        {
            codeValue: string;
            latitude: number | null;
            longitude: number | null;
            locationName: string;
        }
    >();
    // const {
    //     state: { token },
    // } = useOnboardingForm();

    // Transparent rectangle in center (for ID)
    const rectWidth = windowWidth;
    const rectHeight = windowHeight * 0.28;
    const rectX = (windowWidth - rectWidth) / 2;
    const rectY = (windowHeight - rectHeight * 1.5) / 2;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // const [scanned, setScanned] = useState(false);
    const barcodeScannedHandler = useCallback(
        async (details: BarcodeScanningResult) => {
            setLoading(true);

            let locationName = 'Unknown location';
            let latitude: number | null = null;
            let longitude: number | null = null;

            try {
                // Request permission only once; ideally call this on scan screen mount
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status === 'granted') {
                    // Fetch location with a timeout (5s max)
                    const currentLocation = await Promise.race([
                        Location.getCurrentPositionAsync({}),
                        new Promise<null>((_, reject) =>
                            setTimeout(() => reject('Location timeout'), 5000),
                        ),
                    ]);

                    if (currentLocation) {
                        latitude = currentLocation.coords.latitude;
                        longitude = currentLocation.coords.longitude;

                        const places = await Location.reverseGeocodeAsync({
                            latitude,
                            longitude,
                        });

                        // if (places.length > 0) {
                        //     const place = places[0];
                        //     // Build a readable location name with district/city/region/country
                        //     locationName = [
                        //         place.district,
                        //         place.city,
                        //         place.region,
                        //         place.country,
                        //     ]
                        //         .filter(Boolean)
                        //         .join(', ');
                        // }
                        locationName = places[0].formattedAddress ?? 'Unknown location';
                    }
                }
            } catch (locError) {
                console.log('Location error (ignored, scan will continue):', locError);
            }

            try {
                // Send scan to your API
                const res = await sendRequest({
                    url: 'api/v1/client/Product/scan',
                    method: 'POST',
                    data: {
                        codeValue: details.data,
                        latitude,
                        longitude,
                        locationName,
                    },
                });

                const scanResult = res.result as {
                    isGenuine?: boolean;
                    status?: string;
                    message?: string;
                    productName?: string;
                    sku?: string;
                    category?: string;
                    batchNumber?: number;
                    manufacturingDate?: string;
                    expiryDate?: string;
                    tenantName?: string;
                    verificationCount?: number;
                } | null;

                const isGenuine = Boolean(
                    scanResult?.isGenuine === true ||
                    scanResult?.status === 'Genuine' ||
                    scanResult?.status === 'genuine' ||
                    scanResult?.status === 'Valid' ||
                    scanResult?.status === 'valid',
                );

                const payloadWithLocation = {
                    ...(scanResult ?? {}),
                    locationName,
                    latitude,
                    longitude,
                };

                const encodedPayload = encodeURIComponent(JSON.stringify(payloadWithLocation));

                // Navigate to product detail
                router.replace(
                    `/product-detail?isGenuine=${isGenuine}&productData=${encodedPayload}`,
                );
            } catch (apiError) {
                console.log('Scan API error:', apiError);
            } finally {
                setLoading(false);
            }
        },
        [sendRequest, router],
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.light.primaryDark }}>
            <Pressable
                onPress={() => {
                    router.back();
                }}
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
            <View style={layout.flex1}>
                {/* <Header /> */}

                {loading ? (
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 2,
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ActivityIndicator size={'large'} color={colors.light.white} />
                    </View>
                ) : (
                    <CameraView
                        style={StyleSheet.absoluteFill}
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr'],
                        }}
                        onBarcodeScanned={barcodeScannedHandler}
                        enableTorch={true}
                    />
                )}

                {/* === Dark overlay with transparent center === */}
                <Svg
                    pointerEvents="none"
                    width={windowWidth}
                    height={windowHeight}
                    style={StyleSheet.absoluteFill}
                >
                    <Mask id="mask">
                        <Rect x="0" y="0" width={windowWidth} height={windowHeight} fill="white" />
                        <Rect
                            x={rectX}
                            y={rectY}
                            width={rectWidth}
                            height={rectHeight}
                            fill="#001E2C"
                        />
                    </Mask>
                    <Rect
                        x="0"
                        y="0"
                        width={windowWidth}
                        height={windowHeight}
                        fill="#000000C7"
                        mask="url(#mask)"
                    />
                </Svg>

                {/* === Overlay content === */}
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        styles.overlay,
                        !permission?.granted && {
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.light.primaryDark,
                        },
                    ]}
                >
                    {!permission?.granted ? (
                        <Button
                            onPressCallback={requestPermission}
                            title="Grant permission to use camera"
                            style={{
                                margin: 20,
                            }}
                        />
                    ) : (
                        <>
                            <View
                                style={[
                                    styles.instructions,
                                    {
                                        position: 'absolute',
                                        top: rectY - 150,
                                    },
                                ]}
                            >
                                <Image
                                    source={require('#/assets/images/camera.png')}
                                    style={{ width: 40, height: 40 }}
                                />
                                <Text style={styles.cameraScanText}>Camera scan</Text>
                                <Text style={styles.hintText}>
                                    Please scan the front of your ID
                                </Text>
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: rectY + rectHeight,
                                    padding: 20,
                                    alignSelf: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: fonts.TeachersRegular,
                                        fontSize: 15,
                                        color: colors.light.white,
                                    }}
                                >
                                    Please ensure your ID is within the frame
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    permissionButton: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        backgroundColor: colors.light.secondaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    permissionText: {
        color: 'black',
        fontFamily: fonts.TeachersSemiBold,
    },
    instructions: {
        alignItems: 'center',
        // marginTop: 40,
    },
    cameraScanText: {
        fontFamily: fonts.soraBold,
        fontSize: 20,
        color: colors.light.secondaryColor,
        marginTop: 10,
    },
    hintText: {
        fontFamily: fonts.TeachersRegular,
        fontSize: 15,
        color: 'white',
        marginTop: 10,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.light.secondaryColor,
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end',
        // alignSelf: 'center',
        // position: 'absolute',
        // bottom: 40
    },
    captureInnerCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'black',
    },
    roundedCameraWrapper: {
        width: '99.9%',
        height: windowHeight * 0.75,
        borderRadius: 10, // whatever radius you want
        overflow: 'hidden',
        alignSelf: 'center', // optional, if needed
        borderWidth: 2,
        borderColor: 'green', // optional
        // marginBottom: 20
    },
    guidePromptContainer: {
        justifyContent: 'space-evenly',
        paddingVertical: 10,
        alignItems: 'center',
        // flex: 1,
    },
    bodyText: {
        ...typography.body,
    },
    instructionText: {
        ...typography.body,
        color: 'white',
    },
    backPressable: {
        width: 'auto',
        height: 'auto',
        alignSelf: 'flex-start',
        zIndex: 2,
        padding: 10,
        position: 'absolute',
        left: 20,
        top: 20,
    },
});
