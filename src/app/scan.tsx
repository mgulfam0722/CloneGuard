import { Button } from '@/components';
import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
    BarcodeScanningResult,
    CameraView,
    PermissionStatus,
    useCameraPermissions,
} from 'expo-camera';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { Mask, Rect } from 'react-native-svg';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Transparent rectangle in center
const rectWidth = windowWidth * 0.8;
const rectHeight = windowHeight * 0.22;
const rectX = (windowWidth - rectWidth) / 2;
const rectY = rectHeight;

// const isInsideScanArea = (bounds) => {
//     if (!bounds) return false;

//     const { origin, size } = bounds;

//     const centerX = origin.x + size.width / 2;
//     const centerY = origin.y + size.height / 2;

//     // ASSUME camera ≈ screen (ONLY rough heuristic)
//     return (
//         centerX >= rectX &&
//         centerX <= rectX + rectWidth &&
//         centerY >= rectY &&
//         centerY <= rectY + rectHeight
//     );
// };

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const scanAnim = useRef(new Animated.Value(0)).current;
    const [origin, setOrigin] = useState<BarcodeScanningResult | null>();
    const [loading, setLoading] = useState(false);
    const [locationReady, setLocationReady] = useState(false);
    useEffect(() => {
        if (loading || !locationReady) {
            scanAnim.stopAnimation();
            return;
        }
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ]),
        );

        loop.start();

        return () => loop.stop();
    }, [loading, locationReady]);
    const translateY = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [rectY, rectY + rectWidth],
    });
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
            formattedAddress?: string;
        }
    >();

    const router = useRouter();
    const lock = useRef(false);
    const locationRef = useRef<{
        latitude: number | null;
        longitude: number | null;
        locationName: string;
    }>({
        latitude: null,
        longitude: null,
        locationName: 'Unknown location',
    });

    const submitBarcode = useCallback(
        async (details: BarcodeScanningResult) => {
            setLoading(true);
            // console.warn('INVOKED!!');
            try {
                const { latitude, longitude, locationName } = locationRef.current;
                const res = await sendRequest({
                    url: 'api/v1/client/Product/scan',
                    method: 'POST',
                    data: {
                        codeValue: details.data,
                        latitude,
                        longitude,
                        locationName,
                        formattedAddress: locationName,
                    },
                });

                const scanResult = res.result;

                const isGenuine = Boolean(scanResult?.isGenuine);

                router.replace(
                    `/product-detail?isGenuine=${isGenuine}&productData=${encodeURIComponent(
                        JSON.stringify({
                            ...scanResult,
                            latitude,
                            longitude,
                            locationName,
                        }),
                    )}`,
                );
            } catch (err) {
                console.log('Scan API error:', err);
            } finally {
                setLoading(false);
                lock.current = false;
            }
        },
        [locationRef.current, sendRequest, router],
    );

    const barcodeScannedHandler = useCallback(
        async (details: BarcodeScanningResult) => {
            // console.log('origin coordinates: : ', details.bounds.origin.x, details.bounds.origin.y)
            // console.log(isInsideScanArea(details.bounds));
            if (!locationReady) return;

            if (loading || reqLoading) return;

            if (lock.current) return;

            lock.current = true;

            setTimeout(() => {
                submitBarcode(details);
            }, 500); // small debounce
        },
        [submitBarcode, locationReady, loading, reqLoading],
    );

    useEffect(() => {
        let isMounted = true;

        const getLocationName = (place: Location.LocationGeocodedAddress) => {
            return (
                place?.name ||
                place?.district ||
                place?.subregion ||
                place?.city ||
                'Unknown location'
            );
        };

        const initLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    // console.log('Location permission not granted');
                    return;
                }

                // console.log('Get position async...');
                const currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low,
                });
                // console.log('currentLocation: ', currentLocation);
                if (!currentLocation) return;

                const { latitude, longitude } = currentLocation.coords;

                // small delay helps stabilize GPS + geocoder
                // await new Promise((res) => setTimeout(res, 400));

                let locationName = 'Unknown location';

                try {
                    // console.log('Initiating reverse geocode async...');
                    const places = await Location.reverseGeocodeAsync({
                        latitude,
                        longitude,
                    });

                    locationName = getLocationName(places?.[0]);
                } catch (geoErr) {
                    console.error('Reverse geocode failed:', geoErr);
                }

                if (!isMounted) return;

                locationRef.current = {
                    latitude,
                    longitude,
                    locationName,
                };
                // console.log('Done reverse geocoding');
                setLocationReady(true);
            } catch (err) {
                console.error('Location init failed:', err);
            } finally {
                setLocationReady(true);
            }
        };

        initLocation();

        return () => {
            isMounted = false;
        };
    }, []);

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
                ) : !locationReady && permission?.granted ? (
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
                        <Text
                            style={{
                                fontFamily: fonts.TeachersBold,
                                fontSize: 15,
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            Loading your location...
                        </Text>
                    </View>
                ) : (
                    <CameraView
                        style={{
                            position: 'absolute',
                            top: rectY,
                            left: rectX,
                            width: rectWidth,
                            height: rectWidth,
                        }}
                        zoom={0.9}
                        barcodeScannerSettings={{
                            barcodeTypes: [
                                'qr',
                                // 'aztec',
                                // 'ean13',
                                // 'ean8',
                                // 'qr',
                                // 'pdf417',
                                // 'upc_e',
                                // 'datamatrix',
                                // 'code39',
                                // 'code93',
                                // 'itf14',
                                // 'codabar',
                                // 'code128',
                                // 'upc_a',
                            ],
                        }}
                        onBarcodeScanned={(d) => {
                            // setTimeout(() => {
                            // }, 3000);
                            barcodeScannedHandler(d);
                        }}
                        // enableTorch={true}
                    />
                )}
                {!loading && locationReady && (
                    <Animated.View
                        style={{
                            position: 'absolute',
                            left: rectX,
                            top: 0,
                            width: rectWidth,
                            height: 2,
                            backgroundColor: 'red',
                            transform: [{ translateY }],
                            opacity: 0.9,
                        }}
                    />
                )}
                {/* {origin?.bounds && (
                    <View
                        style={{
                        position: 'absolute',
                        top: origin.bounds.origin.x,
                        left: origin.bounds.origin.y,
                        width: origin.bounds.size.width,
                        height: origin.bounds.size.height,
                        borderWidth: 2,
                        borderColor: 'lime',
                        zIndex: 10,
                        }}
                    />
                )} */}
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
                            height={rectWidth}
                            fill="black"
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
                    {permission?.status !== PermissionStatus.GRANTED ? (
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
                                        top: rectY - 100,
                                    },
                                ]}
                            >
                                {/* <Image
                                    source={require('#/assets/images/camera.png')}
                                    style={{ width: 40, height: 40 }}
                                /> */}
                                <MaterialCommunityIcons
                                    name="qrcode-scan"
                                    size={40}
                                    color="white"
                                />
                                <Text style={styles.cameraScanText}>Scan Product Code</Text>
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: rectY + rectWidth,
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
                                    Align QR code or barcode within the frame
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
