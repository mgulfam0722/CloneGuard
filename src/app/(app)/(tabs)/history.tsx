import colors from '@/constants/colors';
import { useListScans } from '@/hooks';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const scaleFactor = width / 375;
const fontScale = Math.min(scaleFactor, 1.2);

export default function History() {
    const { height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const [selectedFilter, setSelectedFilter] = useState('All');
    const {
        dispatch,
        loading: scansLoading,
        state: { page, scans, refreshTrigger, status },
        // fetchBookings
    } = useListScans();
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
                    Scan History
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
                        paddingHorizontal: 3.5,
                        marginHorizontal: 10,
                        // paddingVertical: 5,
                    }}
                >
                    <TouchableOpacity
                        style={
                            selectedFilter === 'All'
                                ? { ...styles.pill }
                                : {
                                      ...styles.pill,
                                      backgroundColor: 'transparent',
                                  }
                        }
                        onPress={() => setSelectedFilter('All')}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                color: selectedFilter === 'All' ? colors.light.white : 'black',
                                fontSize: 15,
                            }}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            selectedFilter === 'Genuine'
                                ? { ...styles.pill }
                                : {
                                      ...styles.pill,
                                      backgroundColor: 'transparent',
                                  }
                        }
                        onPress={() => setSelectedFilter('Genuine')}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                color: selectedFilter === 'Genuine' ? colors.light.white : 'black',
                                fontSize: 15,
                            }}
                        >
                            Genuine
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            selectedFilter === 'Fake'
                                ? { ...styles.pill }
                                : {
                                      ...styles.pill,
                                      backgroundColor: 'transparent',
                                  }
                        }
                        onPress={() => setSelectedFilter('Fake')}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                color: selectedFilter === 'Fake' ? colors.light.white : 'black',
                                fontSize: 15,
                            }}
                        >
                            Fake
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <FlatList
                        data={scans}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingBottom: 200 * scaleFactor,
                            marginTop: 10,
                            paddingHorizontal: 10,
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
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: item.isGenuine
                                                ? colors.light.secondaryColor
                                                : '#7F241E',
                                            padding: 20,
                                            borderRadius: 16,
                                        }}
                                    >
                                        <Feather
                                            name={item.isGenuine ? 'check-circle' : 'x-circle'}
                                            size={15}
                                            color="white"
                                        />
                                    </View>
                                    <View
                                        style={{
                                            marginLeft: 15,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: fonts.TeachersBold,
                                                fontSize: 15,
                                                color: 'black',
                                            }}
                                        >
                                            {item.productName || 'N/A'}
                                        </Text>
                                        {/* <Text
                                            style={{
                                                fontFamily: fonts.TeachersRegular,
                                                fontSize: 14,
                                                color: colors.light.primaryDark,
                                            }}
                                        >
                                            {item?.location || 'N/A'}
                                        </Text> */}
                                    </View>
                                </View>
                                <View
                                    style={{
                                        // alignSelf: 'flex-end',
                                        alignContent: 'flex-end',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 15,
                                            color: colors.light.primaryDark,
                                        }}
                                    >
                                        {new Date(item.verifiedAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            // hour: '2-digit',
                                            // minute: '2-digit',
                                        })}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: item.isGenuine
                                                ? colors.light.secondaryColor
                                                : '#7F241E',
                                            padding: 10,
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: fonts.TeachersSemiBold,
                                                fontSize: 14,
                                                color: 'white',
                                            }}
                                        >
                                            {item.isGenuine ? 'Genuine' : 'Fake'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: colors.light.secondaryColor,
        paddingVertical: 5,
        marginVertical: 2,
    },
});
