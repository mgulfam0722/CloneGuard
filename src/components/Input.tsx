import colors from '@/constants/colors';
import { typography } from '@/styles/typography';
import { ReactNode } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

type BaseProps = {
    title?: string;
    placeholderText: string;
    onPressCallback?: () => void;
    props?: TextInputProps;
    inputContainerStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    icon?: ReactNode;
    footer?: ReactNode;
    titleStyle?: TextStyle;
};

type PasswordProps = {
    isPassword: true;
    isPasswordHidden: boolean;
    togglePasswordHidden?: () => void;
};

type NonPasswordProps = {
    isPassword?: false;
    isPasswordHidden?: never;
    togglePasswordHidden?: never;
};

type InputProps = BaseProps & (PasswordProps | NonPasswordProps);

export function Input({
    title,
    placeholderText,
    onPressCallback,
    props,
    containerStyle,
    inputContainerStyle,
    isPasswordHidden = false,
    inputStyle,
    icon = null,
    footer = null,
    titleStyle = undefined,
    isPassword = false,
}: InputProps) {
    return (
        <View style={containerStyle}>
            {title && <Text style={[styles.titleText, titleStyle]}>{title}</Text>}
            <View style={inputContainerStyle ?? styles.inputContainer}>
                <TextInput
                    onPress={onPressCallback}
                    placeholder={placeholderText}
                    style={inputStyle ?? styles.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    secureTextEntry={isPassword ? isPasswordHidden : false}
                    placeholderTextColor={colors.light.gray600}
                    {...props}
                />
                {icon && <View style={styles.iconContainer}>{icon}</View>}
            </View>
            {footer}
        </View>
    );
}

const styles = StyleSheet.create({
    titleText: {
        ...typography.body,
        color: colors.light.white,
        paddingLeft: 16,
        marginVertical: 10,
        fontWeight: '400',
    },
    inputContainer: {
        paddingVertical: Platform.OS === 'ios' ? 18 : 4,
        paddingHorizontal: 16,
        borderColor: colors.light.gray700,
        borderWidth: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: colors.light.white,
    },
    input: {
        ...typography.body,
        width: '90%',
        color: 'black',
    },
    iconContainer: {
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        bottom: 0,
        top: 0,
        alignItems: 'center',
    },
});
