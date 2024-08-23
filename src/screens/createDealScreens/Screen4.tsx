import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import BackNextButton from '../../components/BackNextButton';
import Checkbox from '../../components/Checkbox';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ShopDeal_t } from '../../operations/ShopDeal';
import { useTheme } from '../../contexts/ThemeContext';

type Screen4NavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen4">;

export default function Screen4() {
    // Get theme
    const { theme } = useTheme();

    // Date picker visibility
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // Selected end date
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    const navigation = useNavigation<Screen4NavigationProp>();

    // Get previous parameters
    const route = useRoute();
    const {
        previousDeal,
        discountTimes,
        discount,
        discountType,
        maxPoints,
    } = route.params as {
        previousDeal: ShopDeal_t | null,
        discountTimes: { [key: string]: string | null },
        discount: number,
        discountType: number,
        maxPoints: number,
    };

    // Load previous deal values if they exist
    useEffect(() => {
        if (previousDeal) {
            setSelectedDate(previousDeal.endDate ? new Date(previousDeal.endDate) : null);
        }
    }, [previousDeal])

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    const handleNext = () => {
        // Proceed to the next step, passing the selectedDate if chosen
        navigation.navigate('Screen5', {
            previousDeal,
            endDate: selectedDate?.toISOString() || null,
            discountTimes,
            discount,
            discountType,
            maxPoints,
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, { color: Colours.text[theme] }]}>Step 4: End Date (Optional)</Text>
                <Text style={styles.description}>
                    If applicable, please set your offer end date.
                </Text>

                <Checkbox
                    label="No End date"
                    state={!selectedDate}
                    setState={() => setSelectedDate(null)}
                />
                <Checkbox
                    label="Offer ends on..."
                    state={!!selectedDate}
                    setState={showDatePicker}
                />

                <TouchableOpacity style={styles.dateInput}>
                    <Text style={styles.dateText}>
                        {selectedDate ? selectedDate.toDateString() : 'No End Date'}
                    </Text>
                </TouchableOpacity>

                {isDatePickerVisible && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={(event, date) => {
                            if (event.type === 'set') {
                                handleConfirm(date || new Date());
                            } else {
                                hideDatePicker();
                            }
                        }}
                        minimumDate={new Date()} // Prevent selection of past dates
                    />
                )}
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
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: Fonts.condensed,
    },
    description: {
        fontSize: 18,
        color: Colours.bluegrey,
        marginBottom: 20,
    },
    dateInput: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colours.lightgrey,
        backgroundColor: Colours.lightgrey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        fontSize: 18,
        color: Colours.darkgrey,
        fontFamily: Fonts.condensed,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
