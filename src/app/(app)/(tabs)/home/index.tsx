import { Button } from '@/components';
import colors from '@/constants/colors';
import { useListScans } from '@/hooks';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function Home() {
    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375; // Base width for scaling
    const fontScale = Math.min(scaleFactor, 1.2); // Cap maximum scaling
    const fullName = useSessionStore((store) => store.fullName);
    const { loading, data } = useListScans(undefined, 3);
    return (
        <ImageBackground
            source={require('assets/images/initial-background-image.png')}
            style={layout.fill}
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
                    flex: isSmallDevice ? 0.8 : 1,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            width: '70%',
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
                            Welcome,
                        </Text>
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                color: colors.light.white,
                                fontSize: 41 * fontScale,
                                letterSpacing: -2,
                                lineHeight: 30 * fontScale,
                            }}
                            numberOfLines={1}
                        >
                            {fullName?.split(' ')[0] || ''}
                        </Text>
                    </View>
                    <View>
                        {/* <Ionicons
                            name="person"
                            size={40 * scaleFactor}
                            color={colors.light.white}
                        /> */}
                        <FontAwesome name="user-o" size={40 * scaleFactor}
                            color={colors.light.white} />
                    </View>
                </View>
            </View>
            <View
                style={{
                    elevation: 20,
                    backgroundColor: colors.light.primaryDark,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    flex: isSmallDevice ? 4.2 : 5,
                    marginTop: -20,
                    marginHorizontal: -10,
                }}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            source={require('assets/images/qr.png')}
                            style={{
                                width: 131 * scaleFactor,
                                height: 147 * scaleFactor,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                marginTop: 40 * scaleFactor,
                            }}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                fontFamily: fonts.TeachersRegular,
                                fontSize: 14 * fontScale,
                                color: '#F4F3F8',
                                textAlign: 'center',
                                marginTop: 20 * scaleFactor,
                                paddingHorizontal: 60 * scaleFactor,
                            }}
                        >
                            Point your camera at any product QR code or barcode
                        </Text>
                    </View>
                    <Button
                        title="Tap to scan"
                        style={{
                            marginTop: 20 * scaleFactor,
                        }}
                        onPressCallback={() => {
                            router.navigate('/scan');
                        }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 30 * scaleFactor,
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'rgba(230, 70, 70, 0.28)',
                                width: 64 * scaleFactor,
                                height: 64 * scaleFactor,
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14 * scaleFactor,
                            }}
                        >
                            <Ionicons name="alert-circle" size={22 * scaleFactor} color="#FF5A5F" />
                        </View>
                        <View style={{}}>
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersSemiBold,
                                    color: colors.light.white,
                                    fontSize: 18 * fontScale,
                                    marginBottom: 4,
                                }}
                            >
                                Report Fake Product
                            </Text>
                            <Text
                                style={{
                                    color: colors.light.white,
                                    fontSize: 14 * fontScale,
                                    fontFamily: fonts.TeachersRegular,
                                }}
                            >
                                Spotted a suspicious product?{'\n'}Let us know
                            </Text>
                        </View>
                    </View>
                    {(data?.length && !loading) ? <View
                        style={{
                            marginTop: 20,
                            marginHorizontal: 20,
                            overflow: 'hidden'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fonts.TeachersBold,
                                fontSize: 16,
                                color: 'white',
                                padding: 5,
                            }}
                        >
                            Recent Scans
                        </Text>
                        <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'rgba(218, 218, 218, 1)',
                                    padding: 10,
                                    borderRadius: 11,
                                    marginHorizontal: 0,
                                    width: '100%'
                                }}
                            >
                        <FlatList
                            data={data}
                            renderItem={({ item }) => 
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 5
                                }}>
                                    <Entypo name="dot-single" size={24} color={colors.light.secondaryColor} style={{
                                        alignSelf: 'flex-start',
                                        marginRight: 7
                                    }} />
                                    <View>
                                        <Text style={{
                                            fontFamily: fonts.TeachersRegular,
                                            fontSize: 14,
                                            color: 'white',
                                        }}>{item.productName || 'N/A'}</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                fontFamily: fonts.TeachersRegular,
                                                fontSize: 14,
                                                color: 'white',
                                            }} numberOfLines={1}>{item.isGenuine ? 'Genuine' : 'FAKE'}</Text>
                                            <Entypo name="dot-single" size={15} color={colors.light.white} />
                                            <Text style={{
                                                fontFamily: fonts.TeachersRegular,
                                                fontSize: 14,
                                                color: 'white',
                                            }} numberOfLines={1}>{new Date(item.verifiedAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                // hour: '2-digit',
                                                // minute: '2-digit',
                                            })}</Text>
                                            <Entypo name="dot-single" size={15} color={colors.light.white} />
                                            <Text style={{
                                                fontFamily: fonts.TeachersRegular,
                                                fontSize: 14,
                                                color: 'white',
                                            }} numberOfLines={1}>Saddar, Karachi</Text>
                                        </View>
                                    </View>
                                </View>}
                        />
                        </View>
                    </View> : null}
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
