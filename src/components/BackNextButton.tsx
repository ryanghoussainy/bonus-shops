import { TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import Colours from "../config/Colours";
import { useTheme } from "../contexts/ThemeContext";

export default function BackNextButton(
    {
        onPress,
        title,
        icon,
        direction,
        disabled
    }: {
        onPress: () => void,
        title: string,
        icon: keyof typeof Ionicons.glyphMap,
        direction: 'back' | 'next',
        disabled?: boolean
    }) {
    // Get theme
    const { theme } = useTheme();

    // Check if the button is disabled
    if (disabled && direction === 'next') {
        return null;
    }

    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: Colours.primary[theme] }]} onPress={onPress}>
            <View style={styles.iconContainer}>
                {direction === 'back' && <Ionicons name={icon} size={24} color="white" />}
                <Text style={styles.text}>{title}</Text>
                {direction === 'next' && <Ionicons name={icon} size={24} color="white" />}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
