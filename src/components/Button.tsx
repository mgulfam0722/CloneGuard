import colors from '@/constants/colors';
import { layout } from '@/styles/common';
import { fonts, typography } from '@/styles/typography';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

export function Button({
    title,
    onPressCallback,
    style,
    props,
    containerProps,
}: {
    title: string;
    onPressCallback?: () => void;
    style?: ViewStyle;
    containerProps?: ViewProps;
    props?: TouchableOpacityProps;
}) {
    return (
        <View style={layout.center} {...containerProps}>
            <TouchableOpacity
                testID="button"
                style={[
                    styles.buttonStyle,
                    ,
                    {
                        backgroundColor: props?.disabled
                            ? colors.light.gray600
                            : colors.light.secondaryColor,
                        ...style,
                    },
                ]}
                onPress={onPressCallback}
                {...props}
            >
                <Text
                    style={[
                        typography.body,
                        {
                            color: 'white',
                            fontFamily: fonts.TeachersSemiBold,
                        },
                    ]}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: colors.light.secondaryColor,
        paddingHorizontal: 50,
    },
});
