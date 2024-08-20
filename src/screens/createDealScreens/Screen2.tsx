import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import BackNextButton from '../../components/BackNextButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { useRoute } from '@react-navigation/native';
import { ShopDeal_t } from '../../operations/ShopDeal';

type Screen2NavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen2">;

export default function Screen2() {
    const [discount, setDiscount] = useState('');
    const [cursorPos, setCursorPos] = useState(0);
    const navigation = useNavigation<Screen2NavigationProp>();
    
    // Get previous parameters
    const route = useRoute();
    const {
        previousDeal,
        discountType,
        maxPoints,
    } = route.params as {
        previousDeal: ShopDeal_t | null,
        discountType: number,
        maxPoints: number,
    };

    // Load previous deal values if they exist
    useEffect(() => {
        if (previousDeal) {
            const discountValue = previousDeal.discount.toString() + ' %';
            setDiscount(discountValue);
            setCursorPos(discountValue.length - 2); // Set cursor position just before the '%' sign
        }
    }, [previousDeal]);
    

    const formatDiscount = (input: string) => {
        // Remove any non-numeric characters except for the decimal point
        let cleaned = input.replace(/[^0-9.]/g, '');

        // Split the input by the decimal point
        let [integer, decimal] = cleaned.split('.');

        // Limit the integer part to 3 digits (for up to 100)
        if (integer.length > 3) {
            integer = integer.slice(0, 3);
        }

        // Limit the decimal part to 2 digits
        if (decimal) {
            decimal = decimal.slice(0, 2);
        }

        // Join the integer and decimal parts, adding a decimal point if necessary
        let formatted = decimal !== undefined ? `${integer}.${decimal}` : integer;

        // Ensure we don't exceed 100.00
        if (parseFloat(formatted) > 100) {
            formatted = '100.00';
        }

        // Ensure we don't have a leading zero
        if (formatted.startsWith('0') && formatted.length > 1) {
            formatted = formatted.slice(1);
        }

        // Ensure we have at least one digit before the decimal point
        if (formatted.startsWith('.')) {
            formatted = '0' + formatted;
        }

        return formatted;
    };

    const handleChangeText = (input: string) => {
        const formatted = formatDiscount(input);
        setDiscount(formatted + ' %');

        // Set the cursor position before the percentage sign
        setCursorPos(formatted.length);
    };

    const checkValidDiscount = () => {
        const value = parseFloat(discount.replace(' %', ''));
        return value > 0 && value <= 100;
    };

    const handleNext = () => {
        if (checkValidDiscount()) {
            navigation.navigate("Screen3", {
                previousDeal,
                discount: parseInt(discount.replace(' %', '')),
                discountType,
                maxPoints
            });
        } else {
            Alert.alert("Invalid discount", "Please enter a discount between 1 and 100.")
        }
    }

    // Show the next button when the discount is valid
    const [showNext, setShowNext] = useState(false);

    useEffect(() => {
        setShowNext(checkValidDiscount());
    }, [discount])

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Step 2: Set Discount Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colours.bluegrey[Colours.theme]}
                    keyboardType="numeric"
                    placeholder="Enter Discount %"
                    value={discount}
                    onChangeText={handleChangeText}
                    onSelectionChange={(event) => {
                        // Keep the cursor just before the % sign
                        if (event.nativeEvent.selection.start > cursorPos) {
                            setCursorPos(cursorPos);
                        }
                    }}
                    selection={{ start: cursorPos, end: cursorPos }}
                />
            </View>

            <View style={styles.buttonContainer}>
                <BackNextButton
                    onPress={() => navigation.goBack()}
                    title="Back"
                    icon="arrow-back"
                    direction="back"
                />
                <BackNextButton
                    onPress={handleNext}
                    title="Next"
                    icon="arrow-forward"
                    direction="next"
                    disabled={!showNext}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colours.background[Colours.theme],
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: Fonts.condensed,
        color: Colours.text[Colours.theme],
    },
    button: {
        backgroundColor: Colours.primary[Colours.theme],
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        marginBottom: 20,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    
})
