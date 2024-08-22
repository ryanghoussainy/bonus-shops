import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import Colours from "../config/Colours";
import Fonts from "../config/Fonts";
import { useTheme } from "../contexts/ThemeContext";

export default function Checkbox(
    {
        label,
        state,
        setState,
    }: {
        label: string,
        state: boolean,
        setState: (value: boolean) => void,
    }) {
    // Get theme
    const { theme } = useTheme();

    return (
        <View style={styles.checkboxContainer}>
            <TouchableOpacity
                style={[styles.checkbox, state && styles.checkedCheckbox]}
                onPress={() => setState(!state)}
            >
                {state && <View style={[styles.checkboxInner, { backgroundColor: Colours.text[theme] }]} />}
            </TouchableOpacity>
            <Text style={[styles.checkboxLabel, { color: Colours.text[theme] }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: Colours.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCheckbox: {
        backgroundColor: Colours.primary,
    },
    checkboxInner: {
        width: 12,
        height: 12,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        fontFamily: Fonts.condensed,
    },
})
