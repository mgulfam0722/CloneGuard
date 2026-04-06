import { Button } from '@/components';
import colors from '@/constants/colors';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Dimensions, ImageBackground, ScrollView, Text, View } from 'react-native';

export default function ProductDetail() {
    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375;
    const fontScale = Math.min(scaleFactor, 1.2);
    return (
        <ImageBackground
            source={require('assets/images/initial-background-image.png')}
            style={layout.fill}
        >
            <View
                style={{
                    backgroundColor: '#7F241E',
                    paddingHorizontal: 20 * scaleFactor,
                    paddingTop: 30 * scaleFactor,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    flex: isSmallDevice ? 0.25 : 0.2,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: '90%',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: fonts.TeachersSemiBold,
                                        color: colors.light.white,
                                        fontSize: 41 * fontScale,
                                        // lineHeight: 30,
                                        letterSpacing: -2,
                                    }}
                                >
                                    Fake Product
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: fonts.TeachersRegular,
                                        color: colors.light.white,
                                        fontSize: 41 * fontScale,
                                        letterSpacing: -2,
                                        lineHeight: 40 * fontScale,
                                    }}
                                    numberOfLines={1}
                                >
                                    Detected
                                </Text>
                            </View>
                            <View>
                                <Entypo name="circle-with-cross" size={20} color="#D36C64" />
                            </View>
                        </View>
                        <Text
                            style={{
                                color: '#F4F3F8',
                                fontFamily: fonts.TeachersRegular,
                                marginTop: 10 * scaleFactor,
                                fontSize: 13 * fontScale,
                            }}
                        >
                            This code has been scanned 4× before in 3 locations
                        </Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                    elevation: 20,
                    backgroundColor: '#FEEDEC',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    flex: isSmallDevice ? 3.75 : 0.8,
                    marginTop: -20,
                    marginHorizontal: -10,
                }}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 100 * scaleFactor,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            padding: 30 * scaleFactor,
                            borderWidth: 2,
                            borderColor: '#7F241E',
                            margin: 30 * scaleFactor,
                            borderRadius: 11,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                fontSize: 14 * fontScale,
                                color: colors.light.secondaryColor,
                            }}
                        >
                            This QR code has been copied or reused. Do not consume this product.
                            Contact the brand or report to DRAP immediately.
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#7F241E',
                                width: 64 * scaleFactor,
                                height: 64 * scaleFactor,
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14 * scaleFactor,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="file-document-multiple-outline"
                                size={22 * scaleFactor}
                                color="white"
                            />
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersSemiBold,
                                    color: colors.light.primaryDark,
                                    fontSize: 18 * fontScale,
                                    marginBottom: 4,
                                }}
                            >
                                Unknown Pharma Tablet
                            </Text>
                            <Text
                                style={{
                                    color: '#7F241E',
                                    fontSize: 14 * fontScale,
                                    fontFamily: fonts.TeachersRegular,
                                }}
                            >
                                Authenticity: FAILED
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 30 * scaleFactor,
                            paddingHorizontal: 30 * scaleFactor,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersBold,
                                fontSize: 15 * fontScale,
                            }}
                        >
                            Scan Count
                        </Text>
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                fontSize: 14 * fontScale,
                                color: '#7F241E',
                                marginTop: 4 * scaleFactor,
                            }}
                        >
                            4 scans
                        </Text>
                    </View>

                    <View
                        style={{
                            marginTop: 30 * scaleFactor,
                            paddingHorizontal: 30 * scaleFactor,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersBold,
                                fontSize: 15 * fontScale,
                            }}
                        >
                            Location noted:
                        </Text>
                        <View
                            style={{
                                marginTop: 10 * scaleFactor,
                                borderRadius: 11,
                                borderColor: '#107FB6',
                                borderWidth: 1,
                                padding: 20 * scaleFactor,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14 * fontScale,
                                    color: '#7F241E',
                                }}
                            >
                                Your location logged to help authorities
                            </Text>
                        </View>
                    </View>

                    <Button
                        style={{
                            backgroundColor: '#7F241E',
                            marginTop: 30 * scaleFactor,
                        }}
                        onPressCallback={() => {
                            router.navigate('/home/report-product');
                        }}
                        title="Report this product"
                    />
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
