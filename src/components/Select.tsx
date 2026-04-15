import colors from '@/constants/colors';
import { fonts, typography } from '@/styles/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export function Select<T extends { [key: string]: any }>({
    title,
    placeholderText,
    onPressCallback,
    options,
    value,
    onChange,
    titleStyle = undefined,
}: {
    placeholderText: string;
    title: string;
    onPressCallback?: () => void;
    options: T[];
    value: string | null;
    onChange: (val: T) => void;
    titleStyle?: TextStyle;
}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownY, setDropdownY] = useState(0);

    // measured height of dropdown (clamped by maxHeight)
    const [dropdownHeight, setDropdownHeight] = useState(0);

    // store input layout measured BEFORE modal opens so we can compute position after dropdown measures
    const [pendingInputLayout, setPendingInputLayout] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    // don't show dropdown until final position is computed (prevents flicker)
    const [isPositioned, setIsPositioned] = useState(false);

    const inputRef = useRef<View>(null);
    const viewRef = useRef<View>(null);

    const MAX_DROPDOWN_RATIO = 0.5; // at most half the screen height
    const SCREEN_PADDING = 12; // keep a small margin from top/bottom

    const openModal = () => {
        // measure input position first
        inputRef.current?.measureInWindow((x, y, width, height) => {
            // save input layout for use after dropdown measures itself
            setPendingInputLayout({ x, y, width, height });

            // set a temporary top (below input). Modal must be visible so the dropdown can layout and fire onLayout
            setDropdownY(y + height);

            // hide until positioned
            setIsPositioned(false);

            // show modal so dropdown renders and triggers onLayout
            setModalVisible(true);
        });
    };

    const handleDropdownLayout = (e: any) => {
        const measuredHeight = e.nativeEvent.layout.height;

        const screenHeight = Dimensions.get('window').height;
        const maxAllowedHeight = Math.floor(screenHeight * MAX_DROPDOWN_RATIO);

        // clamp measured height to maxAllowedHeight so long lists become scrollable
        const clampedHeight = Math.min(measuredHeight, maxAllowedHeight);

        setDropdownHeight(clampedHeight);

        // compute final top using pending input layout (if we have it)
        if (pendingInputLayout) {
            const spaceBelow = screenHeight - (pendingInputLayout.y + pendingInputLayout.height);
            const spaceAbove = pendingInputLayout.y;

            // If not enough space below for the entire clamped dropdown, open upwards
            let finalTop =
                spaceBelow < clampedHeight
                    ? pendingInputLayout.y - clampedHeight // open up
                    : pendingInputLayout.y + pendingInputLayout.height; // open down

            // enforce screen padding
            const minTop = SCREEN_PADDING;
            const maxTop = screenHeight - clampedHeight - SCREEN_PADDING;
            finalTop = Math.max(minTop, Math.min(finalTop, maxTop));

            setDropdownY(finalTop);
            setIsPositioned(true);
        } else {
            // fallback: measure input again (rare)
            inputRef.current?.measureInWindow((x, y, w, h) => {
                const spaceBelow = screenHeight - (y + h);
                let finalTop = spaceBelow < clampedHeight ? y - clampedHeight : y + h;
                const minTop = SCREEN_PADDING;
                const maxTop = screenHeight - clampedHeight - SCREEN_PADDING;
                finalTop = Math.max(minTop, Math.min(finalTop, maxTop));
                setDropdownY(finalTop);
                setIsPositioned(true);
            });
        }
    };

    // close helper
    const close = () => {
        setModalVisible(false);
        setPendingInputLayout(null);
        setDropdownHeight(0);
        setIsPositioned(false);
    };

    const screenMaxHeight = Math.floor(Dimensions.get('window').height * MAX_DROPDOWN_RATIO);

    return (
        <View style={styles.container}>
            <Text style={[styles.titleText, titleStyle]}>{title}</Text>
            <TouchableOpacity ref={inputRef} style={styles.inputContainer} onPress={openModal}>
                {value ? (
                    <Text style={{ fontSize: 16, fontFamily: fonts.TeachersRegular }}>{value}</Text>
                ) : (
                    <Text style={[typography.body, { color: '#D8DADC' }]}>{placeholderText}</Text>
                )}
                <View>
                    <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={close}
                testID="select"
            >
                <TouchableWithoutFeedback onPress={close}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View
                                ref={viewRef}
                                // position using computed top; hide until positioned to avoid flicker
                                style={[
                                    styles.dropdownContainer,
                                    {
                                        top: dropdownY,
                                        // make it scrollable if large; measured height will be clamped by maxHeight style below
                                        maxHeight: screenMaxHeight,
                                        opacity: isPositioned ? 1 : 0,
                                    },
                                ]}
                                onLayout={handleDropdownLayout}
                            >
                                <ScrollView nestedScrollEnabled>
                                    {options.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.dropdownItem,
                                                { borderTopWidth: index !== 0 ? 0.19 : undefined },
                                            ]}
                                            onPress={() => {
                                                onChange(option);
                                                close();
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>{option.title}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 6,
    },
    titleText: {
        ...typography.body,
        color: colors.light.white,
        paddingLeft: 16,
        marginVertical: 10,
        fontWeight: '400',
    },
    inputContainer: {
        justifyContent: 'space-between',
        paddingVertical: Platform.OS === 'ios' ? 18 : 13,
        paddingHorizontal: 16,
        borderColor: colors.light.gray700,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: colors.light.white,
    },
    dropdownText: {
        ...typography.body,
        textAlign: 'left',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 20,
    },
    dropdownContainer: {
        position: 'absolute',
        width: '80%',
        backgroundColor: colors.light.gray300,
        borderRadius: 10,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: 'center',
        overflow: 'hidden', // so ScrollView clamps nicely
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        borderColor: 'black',
    },
});
