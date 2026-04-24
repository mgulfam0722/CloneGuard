import { Button } from '@/components';
import colors from '@/constants/colors';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef } from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

export default function ProductDetail() {
    const router = useRouter();
    const { isGenuine: isGenuineParam = 'false', productData = '{}' } = useLocalSearchParams<{
        isGenuine?: string;
        productData?: string;
    }>();
    const isGenuineBool = isGenuineParam === 'true';
    const { width } = Dimensions.get('window');
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
    const { isAuthenticated } = useSessionStore();
    const viewShotRef = useRef<ViewShot>(null);
    const verificationLogId =
        parsedProductData.verificationLogId ?? (undefined as string | undefined);
    const locationName = (parsedProductData.locationName as string | undefined) ?? '';
    const onShare = async () => {
        try {
            if (!viewShotRef.current?.capture) return;
            const uri = await viewShotRef.current?.capture();

            if (!uri) return;

            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) return;

            await Sharing.shareAsync(uri, {
                mimeType: 'image/png',
                dialogTitle: 'Share Product Scan',
                UTI: 'image/png',
            });
        } catch (err) {
            console.log('Share error:', err);
        }
    };

    return (
        <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1 }}
            style={{
                flex: 1,
            }}
        >
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
                        flex: 0.23,
                        // paddingBottom: isGenuineBool ? 20 * scaleFactor : 0,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingBottom: 30,
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
                            </View>
                        </View>
                        {isGenuineBool && (
                            <View
                                style={{
                                    justifyContent: 'flex-end',
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#F4F3F8',
                                        fontFamily: fonts.TeachersRegular,
                                        fontSize: 13 * fontScale,
                                    }}
                                >
                                    This code has been scanned {scanCount}× before.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View
                    style={{
                        elevation: 20,
                        backgroundColor: contentBackground,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        flex: 0.76,
                        marginTop: -20,
                        // marginHorizontal: -10,
                        paddingTop: 10,
                    }}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
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
                                overflow: 'hidden',
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: isGenuineBool
                                        ? colors.light.secondaryColor
                                        : '#7F241E',
                                    width: isGenuineBool ? 80 : 64,
                                    height: isGenuineBool ? 80 : 64,
                                    borderRadius: 18,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="file-document-multiple-outline"
                                    size={isGenuineBool ? 30 * scaleFactor : 22 * scaleFactor}
                                    color="white"
                                />
                            </View>
                            <View
                                style={{
                                    overflow: 'hidden',
                                    flex: 1,
                                }}
                            >
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
                                    <View
                                        style={{
                                            marginTop: 10 * scaleFactor,
                                            borderRadius: 11,
                                            borderColor: colors.light.secondaryColor,
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
                                            <View
                                                style={{
                                                    width: '50%',
                                                }}
                                            >
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
                                                        // width: '30%'
                                                    }}
                                                >
                                                    {batchNumber}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    width: '50%',
                                                    alignItems: 'flex-end',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: fonts.SoraRegular,
                                                        fontSize: 14 * fontScale,
                                                        color: colors.light.white,
                                                    }}
                                                >
                                                    Mfg. Date
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: fonts.SoraRegular,
                                                        fontSize: 14 * fontScale,
                                                        color: colors.light.white,
                                                    }}
                                                >
                                                    {new Date(manufacturingDate).toLocaleString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            // hour: '2-digit',
                                                            // minute: '2-digit',
                                                        },
                                                    )}
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
                                                    Expiry
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: fonts.SoraRegular,
                                                        fontSize: 14 * fontScale,
                                                        color: colors.light.white,
                                                    }}
                                                >
                                                    {new Date(expiryDate).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        // hour: '2-digit',
                                                        // minute: '2-digit',
                                                    })}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    width: '50%',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: fonts.SoraRegular,
                                                        fontSize: 14 * fontScale,
                                                        color: colors.light.white,
                                                        justifyContent: 'flex-end',
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    Category
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: fonts.SoraRegular,
                                                        fontSize: 14 * fontScale,
                                                        color: colors.light.white,
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {category}
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
                                            {locationName} - helps track distribution
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
                                    onPressCallback={onShare}
                                />
                                <Button
                                    style={{
                                        marginTop: 15 * scaleFactor,
                                    }}
                                    onPressCallback={() => {
                                        router.replace('/scan');
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
                                        marginBottom: 10,
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

                                {/* <View
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
                                </View> */}

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

                                {verificationLogId && (
                                    <Button
                                        style={{
                                            backgroundColor: '#7F241E',
                                            marginTop: 30 * scaleFactor,
                                        }}
                                        onPressCallback={() => {
                                            // router.navigate('/report-product');

                                            if (!isAuthenticated) {
                                                router.navigate('/login');
                                            } else if (verificationLogId) {
                                                router.navigate(
                                                    `/report-product?verificationLogId=${verificationLogId}&locationName=${encodeURIComponent(JSON.stringify(locationName))}`,
                                                );
                                            }
                                        }}
                                        title="Report this product"
                                    />
                                )}

                                <Button
                                    style={{
                                        backgroundColor: '#7F241E',
                                        borderColor: '#7F241E',
                                        borderWidth: 1,
                                        marginTop: 20 * scaleFactor,
                                    }}
                                    title="Share"
                                    onPressCallback={onShare}
                                />
                            </>
                        )}
                    </ScrollView>
                </View>
            </ImageBackground>
        </ViewShot>
    );
}
