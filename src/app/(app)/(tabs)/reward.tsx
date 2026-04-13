import colors from '@/constants/colors';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { Dimensions, ImageBackground, ScrollView, Text, View } from 'react-native';

export default function Home() {
    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375; // Base width for scaling
    const fontScale = Math.min(scaleFactor, 1.2); // Cap maximum scaling
    const fullName = useSessionStore((store) => store.fullName);
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
                    paddingTop: 30 * scaleFactor,
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
                            350
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
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text
                        style={{
                            fontFamily: fonts.TeachersBold,
                            fontSize: 15,
                            color: colors.light.primaryDark,
                            paddingLeft: 15,
                        }}
                    >
                        HOW TO EARN
                    </Text>
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
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: fonts.TeachersBold,
                                        fontSize: 15,
                                        color: colors.light.primaryColor,
                                    }}
                                    numberOfLines={1}
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
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14,
                                    color: colors.light.primaryColor,
                                }}
                                numberOfLines={1}
                            >
                                {'(+10 pts)'}
                            </Text>
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
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: fonts.TeachersBold,
                                        fontSize: 15,
                                        color: colors.light.primaryColor,
                                    }}
                                    numberOfLines={1}
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
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14,
                                    color: colors.light.primaryColor,
                                }}
                                numberOfLines={1}
                            >
                                {'(+100 pts)'}
                            </Text>
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
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: fonts.TeachersBold,
                                        fontSize: 15,
                                        color: colors.light.primaryColor,
                                    }}
                                    numberOfLines={1}
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
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14,
                                    color: colors.light.primaryColor,
                                }}
                                numberOfLines={1}
                            >
                                {'(+50 pts)'}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
