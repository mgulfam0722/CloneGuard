import colors from '@/constants/colors';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const data = [
    {
        id: 1,
        name: 'Panadol Extra 500mg',
        location: 'Saddar, Karachi',
        scanTime: '2024-06-01 14:30',
        result: 'Genuine',
    },
    {
        id: 2,
        name: 'Panadol Extra 500mg',
        location: 'Clifton, Karachi',
        scanTime: '2024-06-02 10:15',
        result: 'Fake',
    },
    {
        id: 3,
        name: 'Panadol Extra 500mg',
        location: 'Gulshan, Karachi',
        scanTime: '2024-06-03 16:45',
        result: 'Genuine',
    },
];

export default function Settings() {
    const { height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const [selectedFilter, setSelectedFilter] = useState('All');
    return (
        <ImageBackground
            source={require('assets/images/initial-background-image.png')}
            style={layout.fill}
        >
            {/* <View
                style={{
                    backgroundColor: colors.light.secondaryColor,
                    // marginHorizontal: 50,
                    paddingHorizontal: 20,
                    paddingTop: 30,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    flex: 0.15,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{
                        paddingBottom: 50,
                    }}>
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
                                        fontSize: 41,
                                        // lineHeight: 30,
                                        letterSpacing: -2,
                                    }}
                                >
                                    Scan
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: fonts.TeachersRegular,
                                        color: colors.light.white,
                                        fontSize: 41,
                                        letterSpacing: -2,
                                        lineHeight: 30,
                                    }}
                                    numberOfLines={1}
                                >
                                    History
                                </Text>
                            </View>
                        </View>
                        {!isSmallDevice && <Text
                            style={{
                                color: '#F4F3F8',
                                fontFamily: fonts.TeachersRegular,
                                marginTop: 10,
                            }}
                        >
                            All your past scans
                        </Text>}
                    </View>
                </View>
            </View> */}
            {/* <View style={{
                height: 20,
                backgroundColor: colors.light.secondaryColor,
            }} /> */}
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
                        data={data}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{
                            paddingHorizontal: 10,
                            marginTop: 10,
                        }}
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
                                            backgroundColor:
                                                item.result === 'Genuine'
                                                    ? colors.light.secondaryColor
                                                    : '#7F241E',
                                            padding: 20,
                                            borderRadius: 16,
                                        }}
                                    >
                                        <Feather
                                            name={
                                                item.result === 'Genuine'
                                                    ? 'check-circle'
                                                    : 'x-circle'
                                            }
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
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: fonts.TeachersRegular,
                                                fontSize: 14,
                                                color: colors.light.primaryDark,
                                            }}
                                        >
                                            {item.location}
                                        </Text>
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
                                        {new Date(item.scanTime).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            // hour: '2-digit',
                                            // minute: '2-digit',
                                        })}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor:
                                                item.result === 'Genuine'
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
                                            {item.result}
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
