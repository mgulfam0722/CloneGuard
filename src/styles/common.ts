import { StyleSheet, ViewStyle } from 'react-native';
import colors from 'src/constants/colors';

type LayoutStyles = {
    fill: ViewStyle;
    center: ViewStyle;
    fillCenter: ViewStyle;
    buttonContainer: ViewStyle;
    mt10: ViewStyle;
    mt25: ViewStyle;
    mb10: ViewStyle;
    mb25: ViewStyle;
    flex1: ViewStyle;
    pb25: ViewStyle;
    flexRow: ViewStyle;
};

export const layout = StyleSheet.create<LayoutStyles>({
    fill: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.light.primaryColor,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fillCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 30,
    },
    mt10: {
        marginTop: 10,
    },
    mt25: {
        marginTop: 25,
    },
    flex1: {
        flex: 1,
    },
    pb25: {
        paddingBottom: 25,
    },
    mb10: {
        marginBottom: 10,
    },
    mb25: {
        marginBottom: 25,
    },
    flexRow: {
        flexDirection: 'row',
    },
});
