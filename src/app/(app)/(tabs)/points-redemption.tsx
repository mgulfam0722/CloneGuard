import colors from '@/constants/colors';
import { useAxiosRequest } from '@/hooks/useAxiosRequest';
import { useRedemptionHistory } from '@/hooks/useRedemptionHistory';
import { useWalletList } from '@/hooks/useWallet';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

const { width, height } = Dimensions.get('window');
const scaleFactor = width / 375;
const fontScale = Math.min(scaleFactor, 1.2);

export default function PointsRedemption() {
    const { height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const [selectedFilter, setSelectedFilter] = useState<'tenants' | 'history'>('tenants');
    const {
        dispatch,
        loading: scansLoading,
        state: { page, list, refreshTrigger },
    } = useWalletList();
    const router = useRouter();
    const { sendRequest, loading: redeeming } = useAxiosRequest<{
        couponCode: string;
        couponValue: number;
        pointsSpent: number;
        remainingBalance: number;
        redemptionNote: string;
        redemptionUrl: string;
    }>();
    const {
        dispatch: redemptionHistoryDispatch,
        loading: redemptionHistoryLoading,
        state: { page: redemptionPage, list: redemptionList, refreshTrigger: redemptionRefresh },
    } = useRedemptionHistory();
    return (
        <ImageBackground
            source={require('assets/images/initial-background-image.png')}
            style={layout.fill}
        >
            <View
                style={{
                    elevation: 20,
                    backgroundColor: colors.light.white,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        fontFamily: fonts.TeachersSemiBold,
                        color: colors.light.secondaryColor,
                        fontSize: 30,
                        marginTop: 30,
                        marginLeft: 20,
                    }}
                >
                    Points Redemption
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 15,
                        borderWidth: 1,
                        borderRadius: 50,
                        borderColor: colors.light.secondaryColor,
                        // paddingHorizontal: 3.5,
                        marginHorizontal: 10,
                        // paddingVertical: 5,
                    }}
                >
                    <TouchableOpacity
                        style={
                            selectedFilter === 'tenants'
                                ? { ...styles.pill }
                                : {
                                      ...styles.pill,
                                      backgroundColor: 'transparent',
                                  }
                        }
                        onPress={() => {
                            setSelectedFilter('tenants');
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                color: selectedFilter === 'tenants' ? colors.light.white : 'black',
                                fontSize: 15,
                            }}
                        >
                            Tenants
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            selectedFilter === 'history'
                                ? { ...styles.pill }
                                : {
                                      ...styles.pill,
                                      backgroundColor: 'transparent',
                                  }
                        }
                        onPress={() => {
                            setSelectedFilter('history');
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                color: selectedFilter === 'history' ? colors.light.white : 'black',
                                fontSize: 15,
                            }}
                            numberOfLines={1}
                        >
                            Redeem History
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {selectedFilter === 'tenants' ? (
                        <FlatList
                            data={list ?? []}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{
                                paddingBottom: 200 * scaleFactor,
                                marginTop: 10,
                                paddingHorizontal: 10,
                            }}
                            onEndReached={() => {
                                list?.length &&
                                    list.length >= 10 &&
                                    dispatch({ type: 'PAGE', payload: page + 1 });
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={scansLoading}
                                    onRefresh={() => {
                                        dispatch({
                                            type: 'REFRESH',
                                        });
                                    }}
                                />
                            }
                            ListEmptyComponent={() =>
                                !scansLoading && (
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            padding: 20,
                                        }}
                                    >
                                        No records!
                                    </Text>
                                )
                            }
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        marginVertical: 10,
                                        padding: 15,
                                        borderRadius: 10,
                                        // backgroundColor: colors.light.secondaryColor,
                                        borderColor: colors.light.secondaryColor,
                                        borderWidth: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {' '}
                                            {item.tenantName}
                                        </Text>
                                        <Text>{item.pointBalance} pts</Text>
                                    </View>
                                    <View>
                                        {item.canRedeem && (
                                            <TouchableOpacity
                                                style={{
                                                    padding: 10,
                                                    backgroundColor: colors.light.primaryColor,
                                                    borderRadius: 5,
                                                }}
                                                onPress={() => {
                                                    Alert.alert(
                                                        'Confirm Redemption',
                                                        `Spend ${item.pointsPerCoupon} points for a ${item.couponValue} AED coupon?`,
                                                        [
                                                            {
                                                                text: 'Cancel',
                                                                style: 'cancel',
                                                            },
                                                            {
                                                                text: 'Confirm',
                                                                onPress: async () => {
                                                                    try {
                                                                        // Call redeem API
                                                                        const { result, status } =
                                                                            await sendRequest({
                                                                                url: 'api/v1/client/Points/redeem',
                                                                                method: 'POST',
                                                                                data: {
                                                                                    tenantId:
                                                                                        item.tenantId,
                                                                                },
                                                                            });
                                                                        status &&
                                                                            showMessage({
                                                                                message:
                                                                                    'Redemption successful!',
                                                                                type: 'success',
                                                                            });

                                                                        // Refresh wallet list
                                                                        dispatch({
                                                                            type: 'REFRESH',
                                                                        });
                                                                    } catch (err) {
                                                                        console.warn(
                                                                            'Redemption error',
                                                                            err,
                                                                        );
                                                                    }
                                                                },
                                                            },
                                                        ],
                                                    );
                                                }}
                                            >
                                                <Text style={{ color: 'white' }}>Redeem</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        />
                    ) : (
                        <FlatList
                            data={redemptionList ?? []}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{
                                paddingBottom: 200 * scaleFactor,
                                marginTop: 10,
                                paddingHorizontal: 10,
                            }}
                            onEndReached={() => {
                                redemptionList?.length &&
                                    redemptionList.length >= 10 &&
                                    redemptionHistoryDispatch({ type: 'PAGE', payload: page + 1 });
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={redemptionHistoryLoading}
                                    onRefresh={() => {
                                        redemptionHistoryDispatch({
                                            type: 'REFRESH',
                                        });
                                    }}
                                />
                            }
                            ListEmptyComponent={() =>
                                !redemptionHistoryLoading && (
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            padding: 20,
                                        }}
                                    >
                                        No records!
                                    </Text>
                                )
                            }
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        marginVertical: 10,
                                        padding: 15,
                                        borderRadius: 10,
                                        borderColor: colors.light.secondaryColor,
                                        borderWidth: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {item.tenantName}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 5,
                                            }}
                                        >
                                            <Text style={{ fontWeight: 'bold' }}>
                                                Points used: {item.pointsUsed}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 5,
                                            }}
                                        >
                                            <Text style={{ fontWeight: 'bold' }}>
                                                Coupon value: {item.couponValue} AED
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 5,
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                borderColor: colors.light.primaryColor,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 4,
                                                    marginRight: 10,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.couponCode}
                                            </Text>
                                            <View
                                                style={{
                                                    borderRadius: 5,
                                                }}
                                            >
                                                <AntDesign
                                                    name="copy"
                                                    size={24}
                                                    color="black"
                                                    onPress={async () => {
                                                        await Clipboard.setStringAsync(
                                                            item.couponCode,
                                                        );
                                                        showMessage({
                                                            message:
                                                                'Coupon code copied to clipboard!',
                                                            type: 'success',
                                                        });
                                                    }}
                                                    style={{
                                                        borderLeftWidth: 1,
                                                        borderColor: colors.light.primaryColor,
                                                        padding: 4,
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    pill: {
        flex: 1,
        minWidth: 100,
        // marginHorizontal: 4,
        paddingVertical: 8,
        borderRadius: 50,
        backgroundColor: colors.light.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '50%',
    },
    pillInactive: {
        backgroundColor: 'transparent',
    },
    pillText: {
        fontFamily: fonts.TeachersRegular,
        fontSize: 15,
        textAlign: 'center',
    },
});
