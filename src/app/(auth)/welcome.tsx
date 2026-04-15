import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    LayoutChangeEvent,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import colors from 'src/constants/colors';
import { layout } from 'src/styles/common';
import { fonts } from 'src/styles/typography';

const { width } = Dimensions.get('window');
const scaleFactor = width / 375;
const fontScale = Math.min(scaleFactor, 1.2);

export default function Welcome() {
    const router = useRouter();

    const SLIDER_HEIGHT = 56;
    const KNOB_SIZE = 48;
    const KNOB_PADDING = 6;

    const trackWidth = useSharedValue(0);
    const translateX = useSharedValue(0);

    const navigateToLogin = () => {
        router.replace('/login');
    };

    const onLayoutTrack = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        trackWidth.value = width;
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            const maxTranslate = trackWidth.value - KNOB_SIZE - KNOB_PADDING * 2;

            translateX.value = Math.min(Math.max(0, e.translationX), maxTranslate);
        })
        .onEnd(() => {
            const maxTranslate = trackWidth.value - KNOB_SIZE - KNOB_PADDING * 2;

            if (translateX.value > maxTranslate * 0.95) {
                translateX.value = withTiming(maxTranslate, { duration: 200 }, (finished) => {
                    if (finished) {
                        runOnJS(navigateToLogin)();
                    }
                });
            } else {
                translateX.value = withTiming(0, { duration: 300 });
            }
        });

    const sliderStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <ImageBackground
            source={require('assets/images/initial-background-image.png')}
            style={layout.fill}
        >
            <View
                style={[
                    layout.flex1,
                    {
                        justifyContent: 'flex-end',
                    },
                ]}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <View>
                        <Image 
                            source={require('#/assets/images/splash-icon.png')}
                            style={{
                                width: 196,
                                height: 180,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            fontFamily: fonts.TeachersBold,
                            letterSpacing: -4,
                            fontSize: fontScale * 68,
                            color: colors.light.white,
                            marginBottom: 15,
                            marginTop: -40
                        }}
                    >
                        Authentify
                    </Text>
                    <View>
                        <Text
                            style={{
                                color: colors.light.white,
                                textAlign: 'center',
                                fontFamily: fonts.TeachersRegular,
                                fontSize: 15,
                                paddingHorizontal: 50
                            }}
                        >
                            Instantly verify any product is real before you buy or consume it
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 40
                        }}
                    >
                        {/* <MaterialCommunityIcons
                            name="gift-open-outline"
                            size={24}
                            color={colors.light.secondaryColor}
                        /> */}
                        <Image source={require('#/assets/images/gift.png')} style={{
                            width: 25,
                            height: 25,
                            resizeMode: 'contain',
                            marginRight: 5,
                        }} />
                        <Text
                            style={{
                                marginLeft: 5,
                                fontFamily: fonts.TeachersSemiBold,
                                color: colors.light.white,
                                fontSize: 14,
                            }}
                        >
                            Join & earn rewards
                        </Text>
                    </View>
                    <View
                        style={{
                            padding: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#11454C',
                            marginHorizontal: 30,
                            borderWidth: 1,
                            borderColor: '#32AB45',
                            marginTop: 20,
                            borderRadius: 15,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.light.white,
                                fontFamily: fonts.TeachersRegular,
                            }}
                        >
                            Get 100 pts free on sign-up. Earn more with every scan you make.
                        </Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.track} onLayout={onLayoutTrack}>
                        <Text style={styles.text}>Get started</Text>

                        <GestureDetector gesture={panGesture}>
                            <Animated.View style={[styles.slider, sliderStyle]}>
                                <Image
                                    source={require('assets/images/right.png')}
                                    style={{
                                        height: 45,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </Animated.View>
                        </GestureDetector>

                        <View
                            style={{
                                position: 'absolute',
                                right: 20,
                            }}
                        >
                            <Image source={require('assets/images/group.png')} />
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 30,
        // borderWidth: 3,
        // borderColor: 'red',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    track: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light.white,
        borderRadius: 40,
        height: 56,
        width: Dimensions.get('window').width * 0.8,
        justifyContent: 'center',
        overflow: 'hidden',
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    text: {
        position: 'absolute',
        color: '#002245',
        fontFamily: fonts.soraSemiBold,
        fontWeight: '600',
        fontSize: 20,
        letterSpacing: -0.8,
    },
    slider: {
        position: 'absolute',
        left: 6,
        height: 48,
        width: 48,
        borderRadius: 40,
        backgroundColor: colors.light.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
});
