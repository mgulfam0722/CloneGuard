import { Button } from '@/components';
import colors from '@/constants/colors';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, View } from 'react-native';

export default function ProductDetail() {
    const router = useRouter();
    const { isGenuine: isGenuineParam = 'false', productData = '{}' } = useLocalSearchParams<{
        isGenuine?: string;
        productData?: string;
    }>();
    const isGenuineBool = isGenuineParam === 'true';
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375;
    const fontScale = Math.min(scaleFactor, 1.2);

    let parsedProductData: Record<string, any> = {};
    try {
        parsedProductData = JSON.parse(decodeURIComponent(productData));
    } catch (error) {
        parsedProductData = {};
    }

    const headerBackground = isGenuineBool ? colors.light.secondaryColor : '#7F241E';
    const contentBackground = isGenuineBool ? colors.light.primaryDark : '#FEEDEC';
    const headerTitle = isGenuineBool ? 'Genuine' : 'Fake Product';
    const headerSubtitle = isGenuineBool ? 'Product' : 'Detected';
    const infoTitle = parsedProductData.productName ?? 'N/A';
    const infoSubtitle = isGenuineBool
        ? (parsedProductData.tenantName ?? 'GSK Pakistan Ltd.')
        : (parsedProductData.message ?? 'Authenticity: FAILED');
    const infoTextColor = isGenuineBool ? colors.light.white : '#7F241E';
    const scanCount = parsedProductData.verificationCount ?? 4;
    const batchNumber = parsedProductData.batchNumber ?? 'PKR-2024-041';
    const manufacturingDate = parsedProductData.manufacturingDate ?? 'N/A';
    const expiryDate = parsedProductData.expiryDate ?? 'N/A';
    const category = parsedProductData.category ?? '';
    const sku = parsedProductData.sku ?? '';

    const [loading, setlaoding] = useState(false);

    return (
        <ImageBackground
            source={require('assets/images/initial-background-image.png')}
            style={layout.fill}
        >
            <View
                style={{
                    backgroundColor: headerBackground,
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
                    paddingBottom: isGenuineBool ? 20 * scaleFactor : 0,
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
                                        letterSpacing: -2,
                                    }}
                                >
                                    {headerTitle}
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
                                    {headerSubtitle}
                                </Text>
                            </View>
                            <View>
                                {isGenuineBool ? (
                                    <Feather
                                        name="check-circle"
                                        size={30}
                                        color={colors.light.white}
                                        onPress={() => {
                                            router.replace('/home');
                                        }}
                                    />
                                ) : (
                                    <View>
                                        <Entypo
                                            name="circle-with-cross"
                                            size={30}
                                            color="#D36C64"
                                            onPress={() => {
                                                router.replace('/home');
                                            }}
                                        />
                                    </View>
                                )}
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
                            This code has been scanned {scanCount}× before.
                        </Text>
                    </View>
                </View>
            </View>

            <View
                style={{
                    elevation: 20,
                    backgroundColor: contentBackground,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    flex: isSmallDevice ? 3.75 : 0.8,
                    marginTop: -20,
                    marginHorizontal: -10,
                }}
            >
                <ScrollView
                    contentContainerStyle={
                        {
                            // paddingBottom: 100 * scaleFactor,
                        }
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {isGenuineBool && (
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
                                    position: 'absolute',
                                    left: 20,
                                }}
                            />
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: colors.light.white,
                                    fontFamily: fonts.TeachersSemiBold,
                                }}
                            >
                                +10 pts earned! Balance: 360 pts
                            </Text>
                        </View>
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: 30 * scaleFactor,
                            paddingHorizontal: 30 * scaleFactor,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: isGenuineBool
                                    ? colors.light.secondaryColor
                                    : '#7F241E',
                                width: isGenuineBool ? 80 * scaleFactor : 64 * scaleFactor,
                                height: isGenuineBool ? 80 * scaleFactor : 64 * scaleFactor,
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14 * scaleFactor,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="file-document-multiple-outline"
                                size={isGenuineBool ? 30 * scaleFactor : 22 * scaleFactor}
                                color="white"
                            />
                        </View>
                        <View style={isGenuineBool ? { marginLeft: 10 * scaleFactor } : undefined}>
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersSemiBold,
                                    color: isGenuineBool
                                        ? colors.light.white
                                        : colors.light.primaryDark,
                                    fontSize: 18 * fontScale,
                                    marginBottom: 4,
                                }}
                            >
                                {infoTitle}
                            </Text>
                            <Text
                                style={{
                                    color: infoTextColor,
                                    fontSize: 14 * fontScale,
                                    fontFamily: fonts.TeachersRegular,
                                }}
                            >
                                Authenticity: {isGenuineBool ? 'Approved' : 'FAILED'}
                            </Text>
                        </View>
                    </View>

                    {isGenuineBool ? (
                        <>
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
                        </>
                    ) : (
                        <>
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
                                    {infoSubtitle}
                                </Text>
                            </View>

                            <View
                                style={{
                                    marginTop: 10 * scaleFactor,
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
                                    {scanCount} scans
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
                                        Your location has been logged to help authorities
                                    </Text>
                                </View>
                            </View>

                            <Button
                                style={{
                                    backgroundColor: '#7F241E',
                                    marginTop: 30 * scaleFactor,
                                }}
                                onPressCallback={() => {
                                    router.navigate('/report-product');
                                }}
                                title="Report this product"
                            />
                        </>
                    )}
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
