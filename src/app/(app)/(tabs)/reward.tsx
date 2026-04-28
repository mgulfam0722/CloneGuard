import colors from '@/constants/colors';
import { StrictAxiosConfig, useAxiosOnMount, useAxiosRequest, useRewardHistory } from '@/hooks';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Home() {
    const router = useRouter();
    const { width } = Dimensions.get('window');
    const scaleFactor = width / 375; // Base width for scaling
    const fontScale = Math.min(scaleFactor, 1.2); // Cap maximum scaling
    const [selectedPicker, setSelectedPicker] = useState<'earn' | 'history'>('earn');
    const {
        state: { list, page },
        loading,
        dispatch,
    } = useRewardHistory();
    const reqConfig = useCallback((): StrictAxiosConfig<unknown> => {
        return {
            method: 'GET',
            url: 'api/v1/client/Configuration/get-configuration',
        };
    }, []);
    const {
        data,
        refetch,
        loading: rewardConfLoading,
    } = useAxiosOnMount<{
        signupPts: number;
        scanPts: number;
        fakeScanPts: number;
        fakeReportPts: number;
    }>(reqConfig);

    const [pointBalance, setPointBalance] = useState<number | null>(null);

    const { sendRequest, loading: pointsLoading } = useAxiosRequest<{
        pointBalance: number;
    }>();

    useFocusEffect(
        useCallback(() => {
            async function fetchPoints() {
                const response = await sendRequest({
                    method: 'GET',
                    url: 'api/v1/client/Points/total-points',
                });
                if (response) {
                    setPointBalance(response.result.pointBalance);
                }
            }

            fetchPoints();
        }, [sendRequest]),
    );

    return (
        <ImageBackground
            style={[
                layout.fill,
                {
                    backgroundColor: colors.light.white,
                },
            ]}
        >
            <View
                style={{
                    backgroundColor: colors.light.secondaryColor,
                    marginHorizontal: 5,
                    paddingHorizontal: 20 * scaleFactor,
                    paddingTop: 20,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    flex: 0.23,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        flex: 1,
                        paddingBottom: 30,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontFamily: fonts.TeachersSemiBold,
                                color: colors.light.white,
                                fontSize: 41 * fontScale,
                                letterSpacing: -2,
                                textAlign: 'center',
                            }}
                        >
                            {pointBalance !== null ? pointBalance.toString() : '0'}
                        </Text>
                        <Text
                            style={{
                                fontFamily: fonts.TeachersBold,
                                color: colors.light.white,
                                fontSize: 15 * fontScale,
                                textAlign: 'center',
                            }}
                            numberOfLines={1}
                        >
                            Points available
                        </Text>
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                color: colors.light.white,
                                fontSize: 15 * fontScale,
                                textAlign: 'center',
                            }}
                            numberOfLines={1}
                        >
                            Redeem for rewards below
                        </Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                    elevation: 20,
                    backgroundColor: '#F0F0F0',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    flex: 0.76,
                    marginTop: -20,
                    padding: 15,
                }}
            >
                <View style={styles.pickerContainer}>
                    <TouchableOpacity
                        style={
                            selectedPicker === 'earn'
                                ? { ...styles.pill }
                                : {
                                      ...styles.pill,
                                      backgroundColor: 'transparent',
                                  }
                        }
                        onPress={() => {
                            setSelectedPicker('earn');
                        }}
                    >
                        <Text
                            style={[
                                styles.pickerText,
                                {
                                    color: selectedPicker === 'earn' ? colors.light.white : 'black',
                                },
                            ]}
                        >
                            Earn
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={
                            selectedPicker === 'history'
                                ? { ...styles.pill }
                                : {
                                      ...styles.pill,
                                      backgroundColor: 'transparent',
                                  }
                        }
                        onPress={() => {
                            setSelectedPicker('history');
                        }}
                    >
                        <Text
                            style={[
                                styles.pickerText,
                                {
                                    color:
                                        selectedPicker === 'history' ? colors.light.white : 'black',
                                },
                            ]}
                        >
                            History
                        </Text>
                    </TouchableOpacity>
                </View>
                {selectedPicker === 'earn' ? (
                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: 100,
                        }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={rewardConfLoading}
                                onRefresh={() => {
                                    refetch();
                                }}
                            />
                        }
                    >
                        <View
                            style={{
                                backgroundColor: colors.light.white,
                                borderRadius: 14,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 15,
                                marginTop: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '55%',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#EAF3DE',
                                        width: 74,
                                        height: 74,
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Feather name="gift" size={24} color="#628B3E" />
                                </View>
                                <View
                                    style={{
                                        marginLeft: 15,
                                        width: '68%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersBold,
                                            fontSize: 15,
                                            color: colors.light.primaryColor,
                                        }}
                                        // numberOfLines={1}
                                    >
                                        Sign-up bonus
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 14,
                                            color: colors.light.primaryColor,
                                        }}
                                        numberOfLines={1}
                                    >
                                        One time only
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 50,
                                        backgroundColor: colors.light.secondaryColor,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View>
                                        <AntDesign
                                            name={'plus'}
                                            size={10}
                                            color={colors.light.white}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            color: colors.light.white,
                                            fontSize: 15,
                                        }}
                                    >
                                        {data?.signupPts || 0} pts
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                backgroundColor: colors.light.white,
                                borderRadius: 14,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 15,
                                marginTop: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '55%',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#E6F1FB',
                                        width: 74,
                                        height: 74,
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Feather name="box" size={24} color="#185FA5" />
                                </View>
                                <View
                                    style={{
                                        marginLeft: 15,
                                        width: '70%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersBold,
                                            fontSize: 15,
                                            color: colors.light.primaryColor,
                                        }}
                                        // numberOfLines={1}
                                    >
                                        Scan a product
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 14,
                                            color: colors.light.primaryColor,
                                        }}
                                        numberOfLines={1}
                                    >
                                        Per verified scan
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 50,
                                        backgroundColor: colors.light.secondaryColor,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View>
                                        <AntDesign
                                            name={'plus'}
                                            size={10}
                                            color={colors.light.white}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            color: colors.light.white,
                                            fontSize: 15,
                                        }}
                                    >
                                        {data?.scanPts || 0} pts
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                backgroundColor: colors.light.white,
                                borderRadius: 14,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 15,
                                marginTop: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '55%',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#FDEDEC',
                                        width: 74,
                                        height: 74,
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <AntDesign name="warning" size={24} color="#E64646" />
                                </View>
                                <View
                                    style={{
                                        marginLeft: 15,
                                        width: '80%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersBold,
                                            fontSize: 15,
                                            color: colors.light.primaryColor,
                                        }}
                                    >
                                        Fake scan
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 14,
                                            color: colors.light.primaryColor,
                                        }}
                                        numberOfLines={1}
                                    >
                                        First fake scan
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 50,
                                        backgroundColor: colors.light.secondaryColor,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View>
                                        <AntDesign
                                            name={'plus'}
                                            size={10}
                                            color={colors.light.white}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            color: colors.light.white,
                                            fontSize: 15,
                                        }}
                                    >
                                        {data?.fakeScanPts || 0} pts
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                backgroundColor: colors.light.white,
                                borderRadius: 14,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 15,
                                marginTop: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '55%',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#FDEDEC',
                                        width: 74,
                                        height: 74,
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <EvilIcons name="exclamation" size={24} color="#E64646" />
                                </View>
                                <View
                                    style={{
                                        marginLeft: 15,
                                        width: '80%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersBold,
                                            fontSize: 15,
                                            color: colors.light.primaryColor,
                                        }}
                                    >
                                        Report fake product
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 14,
                                            color: colors.light.primaryColor,
                                        }}
                                        numberOfLines={1}
                                    >
                                        First report
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 50,
                                        backgroundColor: colors.light.secondaryColor,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View>
                                        <AntDesign
                                            name={'plus'}
                                            size={10}
                                            color={colors.light.white}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            color: colors.light.white,
                                            fontSize: 15,
                                        }}
                                    >
                                        {data?.fakeReportPts || 0} pts
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                backgroundColor: colors.light.white,
                                borderRadius: 14,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 15,
                                marginTop: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '55%',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#EEEDFD',
                                        width: 74,
                                        height: 74,
                                        borderRadius: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <FontAwesome size={28} name="user-o" color={'#5549B3'} />
                                </View>
                                <View
                                    style={{
                                        marginLeft: 15,
                                        width: '65%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersBold,
                                            fontSize: 15,
                                            color: colors.light.primaryColor,
                                        }}
                                    >
                                        Refer a friend
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 14,
                                            color: colors.light.primaryColor,
                                        }}
                                        // numberOfLines={1}
                                    >
                                        When they scan a product
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 50,
                                        backgroundColor: colors.light.secondaryColor,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View>
                                        <AntDesign
                                            name={'plus'}
                                            size={10}
                                            color={colors.light.white}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            color: colors.light.white,
                                            fontSize: 15,
                                        }}
                                    >
                                        70 pts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                ) : (
                    <FlatList
                        data={list}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => item.id + index}
                        contentContainerStyle={{
                            paddingBottom: 100 * scaleFactor,
                        }}
                        onEndReached={() => {
                            list?.length &&
                                list.length >= 10 &&
                                dispatch({ type: 'PAGE', payload: page + 1 });
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={() => {
                                    dispatch({
                                        type: 'REFRESH',
                                    });
                                }}
                            />
                        }
                        ListEmptyComponent={() =>
                            !loading && (
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
                                    backgroundColor: colors.light.white,
                                    borderRadius: 14,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 15,
                                    marginTop: 15,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '55%',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor:
                                                item.pointsType === 'Fake Scan'
                                                    ? '#FFECEC'
                                                    : '#EAF3DE',
                                            width: 74,
                                            height: 74,
                                            borderRadius: 16,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {item.pointsType === 'Fake Scan' ? (
                                            <AntDesign name="warning" size={24} color="#E64646" />
                                        ) : (
                                            <AntDesign
                                                name="check-square"
                                                size={24}
                                                color="#628B3E"
                                            />
                                        )}
                                    </View>
                                    <View
                                        style={{
                                            marginLeft: 15,
                                            width: '60%',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: fonts.TeachersBold,
                                                fontSize: 15,
                                                color: colors.light.primaryColor,
                                            }}
                                            // numberOfLines={1}
                                        >
                                            {item.pointsType}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: fonts.TeachersRegular,
                                                fontSize: 14,
                                                color: colors.light.primaryColor,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {item.productName}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 50,
                                            backgroundColor: colors.light.secondaryColor,
                                            paddingVertical: 10,
                                            paddingHorizontal: 20,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View>
                                            <AntDesign
                                                name={
                                                    item.transactionType === 'Added'
                                                        ? 'plus'
                                                        : 'minus'
                                                }
                                                size={10}
                                                color={colors.light.white}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                fontFamily: fonts.TeachersRegular,
                                                color: colors.light.white,
                                                fontSize: 15,
                                            }}
                                        >
                                            {item.points} pts
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    pickerText: {
        fontFamily: fonts.TeachersBold,
        fontSize: 15,
        color: colors.light.primaryDark,
        // paddingLeft: 15,
    },
    pill: {
        // paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: colors.light.secondaryColor,
        paddingVertical: 5,
        marginVertical: 2,
        width: '45%',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.light.secondaryColor,
        paddingHorizontal: 3.5,
        marginHorizontal: 10,
        marginBottom: 10,
        // paddingVertical: 5,
    },
});
