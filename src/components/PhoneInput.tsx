import colors from '@/constants/colors';
import { fonts, typography } from '@/styles/typography';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Input } from './Input';

export function PhoneInput({
    value,
    onChangeText,
}: {
    value: string;
    onChangeText?: (text: string) => void;
}) {
    return (
        <>
            {/* <Text style={[typography.body, { alignSelf: 'flex-start', paddingLeft: 16 }]}>
                Phone Number
            </Text> */}
            <View style={styles.inputContainer}>
                <Image
                    source={require('#/assets/images/pak-flag.png')}
                    style={styles.flagImage}
                    testID="flag-image"
                />
                <Text
                    style={{
                        color: colors.light.gray600,
                        fontFamily: fonts.TeachersRegular,
                        fontSize: 17,
                    }}
                >
                    +92
                </Text>
                <View style={styles.line} />
                <View>
                    <Input
                        placeholderText="Phone number"
                        props={{
                            keyboardType: 'phone-pad',
                            maxLength: 11,
                            value,
                            onChangeText,
                            autoCapitalize: 'none',
                            autoComplete: 'off',
                            autoCorrect: false,
                        }}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={{}}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    titleText: {
        ...typography.body,
        color: 'black',
        paddingLeft: 16,
        marginVertical: 10,
        fontWeight: '400',
    },
    inputContainer: {
        flexDirection: 'row',
        height: 56,
        // marginTop: 10,
        paddingHorizontal: 16,
        borderColor: colors.light.gray700,
        borderWidth: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: colors.light.white,
    },
    flagImage: {
        width: 23,
        height: 17,
        resizeMode: 'contain',
        marginRight: 20,
    },
    line: {
        height: 26,
        marginHorizontal: 11,
        borderWidth: 0.7,
        borderColor: colors.light.gray600,
    },
    inputStyle: {
        ...typography.body,
        paddingVertical: 0,
        textAlignVertical: 'center',
        marginVertical: 0,
        width: 250,
        color: colors.light.gray600,
        fontFamily: fonts.TeachersRegular,
        fontSize: 17,
    },
});
