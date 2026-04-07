import { Button } from '@/components';
import colors from '@/constants/colors';
import { useSessionStore } from '@/stores';
import { layout } from '@/styles/common';
import { fonts } from '@/styles/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ImageBackground, ScrollView, Text, View } from 'react-native';

export default function Home() {
    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const isSmallDevice = height < 600;
    const scaleFactor = width / 375; // Base width for scaling
    const fontScale = Math.min(scaleFactor, 1.2); // Cap maximum scaling
    const fullName = useSessionStore((store) => store.fullName);
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
                    <View
                        style={{
                            borderWidth: 5,
                            borderColor: colors.light.white,
                            width: 57 * scaleFactor,
                            height: 57 * scaleFactor,
                            borderRadius: 28.5 * scaleFactor,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons
                            name="person"
                            size={40 * scaleFactor}
                            color={colors.light.white}
                        />
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

                    <View
                        style={{
                            paddingHorizontal: 50,
                            marginTop: 20,
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
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14,
                                    color: 'white',
                                    padding: 5,
                                }}
                            >
                                Panadol Extra 500mg
                            </Text>
                            <Text
                                style={{
                                    fontFamily: fonts.TeachersRegular,
                                    fontSize: 14,
                                    color: 'white',
                                    padding: 5,
                                }}
                            >
                                Genuine • 2 hrs ago • Saddar, Karachi
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

// import React from 'react';
// import {
//     Image,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// // import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const recentScans = [
//   {
//     id: '1',
//     name: 'Panadol Extra 500mg',
//     status: 'Genuine',
//     time: '2 hrs ago',
//     location: 'Saddar, Karachi',
//   },
//   {
//     id: '2',
//     name: 'Unknown Pharma Tablet',
//     status: 'Fake',
//     time: 'Yesterday',
//     location: 'Gulshan, Karachi',
//   },
//   {
//     id: '3',
//     name: 'Dalda Cooking Oil 5L',
//     status: 'Genuine',
//     time: 'Mar 22',
//     location: 'Lahore',
//   },
// ];

// const Home = () => {
//   return (
//       <View style={styles.container}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* Header */}
//           <View style={styles.headerCard}>
//             <View style={styles.headerTextWrapper}>
//               <Text style={styles.welcomeText}>Welcome,</Text>
//               <Text style={styles.nameText}>Ahmed Khan</Text>
//               <Text style={styles.subText}>Scan a product to verify it</Text>
//             </View>

//             <Image
//               source={{
//                 uri: 'https://i.pravatar.cc/150?img=12',
//               }}
//               style={styles.avatar}
//             />
//           </View>

//           {/* Main Card */}
//           <View style={styles.mainCard}>
//             {/* Scan Box */}
//             <View style={styles.scanBox}>
//               <Text style={styles.scanTitle}>Scan to Verify</Text>
//               {/* <MaterialCommunityIcons
//                 name="qrcode-scan"
//                 size={78}
//                 color="#fff"
//               /> */}
//             </View>

//             <Text style={styles.scanDescription}>
//               Point your camera at any product{'\n'}QR code or barcode
//             </Text>

//             <TouchableOpacity style={styles.scanButton} activeOpacity={0.8}>
//               <Text style={styles.scanButtonText}>Tap to Scan</Text>
//             </TouchableOpacity>

//             {/* Report Fake Product */}
//             <TouchableOpacity style={styles.reportCard} activeOpacity={0.8}>
//               <View style={styles.reportIconWrapper}>
//                 {/* <Icon name="alert-circle" size={22} color="#FF5A5F" /> */}
//               </View>

//               <View style={styles.reportTextWrapper}>
//                 <Text style={styles.reportTitle}>Report Fake Product</Text>
//                 <Text style={styles.reportSubtitle}>
//                   Spotted a suspicious product?{'\n'}Let us know
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             {/* Recent Scans */}
//             <Text style={styles.recentTitle}>Recent Scans</Text>

//             <View style={styles.recentCard}>
//               {recentScans.map((item, index) => (
//                 <View key={item.id}>
//                   <View style={styles.scanItem}>
//                     <View style={styles.bullet} />
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.scanItemTitle}>{item.name}</Text>
//                       <Text
//                         style={[
//                           styles.scanItemMeta,
//                           item.status === 'Fake' && styles.fakeText,
//                         ]}
//                       >
//                         {item.status} • {item.time} • {item.location}
//                       </Text>
//                     </View>
//                   </View>

//                   {index !== recentScans.length - 1 && (
//                     <View style={styles.divider} />
//                   )}
//                 </View>
//               ))}
//             </View>
//           </View>
//         </ScrollView>

//       </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#0B8BD1',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#0B8BD1',
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 120,
//   },

//   headerCard: {
//     backgroundColor: '#1D91CF',
//     borderRadius: 28,
//     paddingHorizontal: 22,
//     paddingVertical: 28,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 18,
//   },
//   headerTextWrapper: {
//     flex: 1,
//     paddingRight: 12,
//   },
//   welcomeText: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: '700',
//   },
//   nameText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '300',
//     marginTop: 2,
//   },
//   subText: {
//     color: '#D8F1FF',
//     fontSize: 14,
//     marginTop: 14,
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     borderWidth: 3,
//     borderColor: '#fff',
//   },

//   mainCard: {
//     backgroundColor: '#022A3C',
//     borderRadius: 30,
//     paddingHorizontal: 18,
//     paddingVertical: 26,
//   },

//   scanBox: {
//     alignSelf: 'center',
//     width: 115,
//     borderWidth: 1.5,
//     borderColor: '#1CA9F3',
//     borderRadius: 12,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   scanTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//     marginBottom: 6,
//   },
//   scanDescription: {
//     color: '#DDEBF3',
//     textAlign: 'center',
//     fontSize: 15,
//     marginTop: 16,
//     lineHeight: 22,
//   },

//   scanButton: {
//     backgroundColor: '#1C92D2',
//     borderRadius: 999,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: 18,
//     marginHorizontal: 6,
//   },
//   scanButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   reportCard: {
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 18,
//   },
//   reportIconWrapper: {
//     width: 64,
//     height: 64,
//     borderRadius: 18,
//     backgroundColor: '#5A2E39',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 14,
//   },
//   reportTextWrapper: {
//     flex: 1,
//   },
//   reportTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   reportSubtitle: {
//     color: '#D9E7EE',
//     fontSize: 14,
//     marginTop: 4,
//     lineHeight: 20,
//   },

//   recentTitle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '700',
//     marginTop: 22,
//     marginBottom: 10,
//   },
//   recentCard: {
//     borderWidth: 1,
//     borderColor: '#B7D5E3',
//     borderRadius: 14,
//     padding: 14,
//   },
//   scanItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   bullet: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: '#1EA7F2',
//     marginTop: 7,
//     marginRight: 10,
//   },
//   scanItemTitle: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   scanItemMeta: {
//     color: '#C8D9E2',
//     fontSize: 13,
//     marginTop: 4,
//   },
//   fakeText: {
//     color: '#FF7A7A',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: 'rgba(255,255,255,0.12)',
//     marginVertical: 12,
//   },

//   bottomTab: {
//     position: 'absolute',
//     bottom: 18,
//     alignSelf: 'center',
//     width: 160,
//     height: 46,
//     borderRadius: 24,
//     backgroundColor: '#1D91CF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     paddingHorizontal: 12,
//   },
//   tabItem: {
//     padding: 8,
//   },
// });
