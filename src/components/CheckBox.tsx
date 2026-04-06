import { View, ViewStyle } from 'react-native';
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';

export function Checkbox({
    containerStyle,
    value = false,
    onValueChange,
}: {
    containerStyle?: ViewStyle;
    // props?: CheckBoxProps;
    value?: boolean;
    onValueChange?: (value: boolean | string) => void;
}) {
    return (
        <View style={containerStyle ?? { borderWidth: 0 }}>
            <AdvancedCheckbox
                value={value}
                onValueChange={onValueChange}
                // label="Agree to terms"
                checkedColor="#007AFF"
                uncheckedColor="#ccc"
                size={24}
                testID="checkbox"
            />
        </View>
    );
}
