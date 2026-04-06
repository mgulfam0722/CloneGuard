import { Button } from '@/components';
import colors from '@/constants/colors';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Dimensions, ImageBackground, ScrollView, Text, View } from 'react-native';

export default function GenuineProductDetail() {
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
                    backgroundColor: colors.light.secondaryColor,
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
                    paddingBottom: 20 * scaleFactor,
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
                                    Genuine
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
                                    Product
                                </Text>
                            </View>
                            <View>
                                {/* <Entypo name="circle-with-cross" size={20} color="#053348" /> */}
                                <Feather
                                    name="check-circle"
                                    size={24}
                                    color={colors.light.primaryColor}
                                />
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
                    backgroundColor: colors.light.primaryDark,
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
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 30 * scaleFactor,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: colors.light.secondaryColor,
                                width: 80 * scaleFactor,
                                height: 80 * scaleFactor,
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14 * scaleFactor,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="file-document-multiple-outline"
                                size={30 * scaleFactor}
                                color="white"
                            />
                        </View>
                        <View
                            style={{
                                marginLeft: 10 * scaleFactor,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersSemiBold,
                                    color: colors.light.white,
                                    fontSize: 18 * fontScale,
                                    marginBottom: 4,
                                }}
                            >
                                Panadol Extra 500mg
                            </Text>
                            <Text
                                style={{
                                    color: colors.light.white,
                                    fontSize: 14 * fontScale,
                                    fontFamily: fonts.TeachersRegular,
                                }}
                            >
                                GSK Pakistan Ltd.
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
                                color: colors.light.white,
                            }}
                        >
                            Recent Scans
                        </Text>
                        <View
                            style={{
                                marginTop: 10 * scaleFactor,
                                borderRadius: 11,
                                borderColor: colors.light.primaryColor,
                                borderWidth: 1,
                                padding: 20 * scaleFactor,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 10 * scaleFactor,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        Batch No.
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        PKR-2024-041
                                    </Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        Batch No.
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        PKR-2024-041
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginVertical: 10 * scaleFactor,
                                    borderWidth: 0.2,
                                    borderColor: colors.light.gray600,
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 10 * scaleFactor,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        Batch No.
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        PKR-2024-041
                                    </Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        Batch No.
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.SoraRegular,
                                            fontSize: 14 * fontScale,
                                            color: colors.light.white,
                                        }}
                                    >
                                        PKR-2024-041
                                    </Text>
                                </View>
                            </View>
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
                                color: colors.light.white,
                            }}
                        >
                            Location noted:
                        </Text>
                        <View
                            style={{
                                marginTop: 10 * scaleFactor,
                                borderRadius: 11,
                                backgroundColor: colors.light.secondaryColor,
                                borderWidth: 1,
                                padding: 20 * scaleFactor,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: fonts.SoraRegular,
                                    fontSize: 14 * fontScale,
                                    color: colors.light.white,
                                }}
                            >
                                Saddar, Karachi - helps track distribution
                            </Text>
                        </View>
                    </View>

                    <Button
                        style={{
                            backgroundColor: undefined,
                            borderColor: colors.light.white,
                            borderWidth: 1,
                            marginTop: 20 * scaleFactor,
                        }}
                        title="Share"
                    />
                    <Button
                        style={{
                            marginTop: 15 * scaleFactor,
                        }}
                        onPressCallback={() => {
                            router.navigate('/scan');
                        }}
                        title="Scan Again"
                    />
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
