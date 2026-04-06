import { StyleSheet, TextStyle } from 'react-native';

export const fonts = {
    soraSemiBold: 'Sora-SemiBold',
    soraBold: 'Sora-Bold',
    SoraExtraBold: 'Sora-ExtraBold',
    SoraExtraLight: 'Sora-ExtraLight',
    SoraLight: 'Sora-Light',
    SoraMedium: 'Sora-Medium',
    SoraRegular: 'Sora-Regular',
    SoraThin: 'Sora-Thin',
    TeachersBold: 'Teachers-Bold',
    TeachersBoldItalic: 'Teachers-BoldItalic',
    TeachersExtraBold: 'Teachers-ExtraBold',
    TeachersExtraBoldItalic: 'Teachers-ExtraBoldItalic',
    TeachersItalic: 'Teachers-Italic',
    TeachersMedium: 'Teachers-Medium',
    TeachersMediumItalic: 'Teachers-MediumItalic',
    TeachersRegular: 'Teachers-Regular',
    TeachersSemiBold: 'Teachers-SemiBold',
    TeachersSemiBoldItalic: 'Teachers-SemiBoldItalic',
};

type TypographyStyles = {
    body: TextStyle;
    h1: TextStyle;
    h3: TextStyle;
    subheading: TextStyle;
    caption: TextStyle;
    interText: TextStyle;
    error: TextStyle;
};

export const typography = StyleSheet.create<TypographyStyles>({
    body: {
        fontFamily: fonts.TeachersRegular,
        fontSize: 17,
        color: 'black',
    },
    h1: {
        fontFamily: fonts.TeachersSemiBold,
        fontSize: 50,
    },
    h3: {
        fontFamily: fonts.SoraMedium,
        fontSize: 40,
        fontWeight: '400',
    },
    subheading: {
        fontFamily: fonts.SoraMedium,
        fontSize: 30,
        fontWeight: '600',
    },
    caption: {
        fontFamily: fonts.SoraLight,
        fontSize: 12,
    },
    interText: {
        fontFamily: fonts.SoraRegular,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontFamily: fonts.SoraRegular,
        fontSize: 17,
        fontWeight: '600',
        padding: 15,
    },
});
