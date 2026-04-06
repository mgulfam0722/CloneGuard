import colors from '@/constants/colors';
import { layout } from '@/styles/common';
import { fonts, typography } from '@/styles/typography';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Mask, Rect } from 'react-native-svg';
// import Toast from 'react-native-toast-message';
// import { FacialScanScreenProps, IDFrontScanScreenProps } from '@/types';
// import { cropPhoto } from '@/utils';
// import { useOnboardingForm } from '@/context/UserFormContext';
// import { useIsPhysicalDevice } from '@/hooks';
// import { useAxiosRequest } from '@/hooks';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Hide tab bar on this screen
export const unstable_settings = {
    tabBarStyle: { display: 'none' },
};

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    // const { sendRequest, loading } = useAxiosRequest<{ selfiefileId: string }>();
    // const {
    //     state: { token },
    // } = useOnboardingForm();

    // Transparent rectangle in center (for ID)
    const rectWidth = windowWidth;
    const rectHeight = windowHeight * 0.28;
    const rectX = (windowWidth - rectWidth) / 2;
    const rectY = (windowHeight - rectHeight * 1.5) / 2;
    const router = useRouter();
    // useEffect(() => {
    //     // router.navigate('/home/fake-product-detail');
    //     router.navigate('/home/fake-product-detail');
    // }, [router]);
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

                <CameraView
                    style={StyleSheet.absoluteFill}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={(details) => {
                        router.navigate('/home/genuine-product-detail');
                    }}
                />

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
                <View style={[StyleSheet.absoluteFill, styles.overlay]}>
                    {!permission?.granted ? (
                        <TouchableOpacity
                            onPress={requestPermission}
                            style={styles.permissionButton}
                        >
                            <Text style={styles.permissionText}>Grant Camera Permission</Text>
                        </TouchableOpacity>
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
