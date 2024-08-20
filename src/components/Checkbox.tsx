import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import Colours from "../config/Colours";
import Fonts from "../config/Fonts";

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

    return (
        <View style={styles.checkboxContainer}>
            <TouchableOpacity
                style={[styles.checkbox, state && styles.checkedCheckbox]}
                onPress={() => setState(!state)}
            >
                {state && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>{label}</Text>
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
        borderColor: Colours.primary[Colours.theme],
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCheckbox: {
        backgroundColor: Colours.primary[Colours.theme],
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: 'white',
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
})
