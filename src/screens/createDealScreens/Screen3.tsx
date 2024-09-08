import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import BackNextButton from '../../components/BackNextButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import RNPickerSelect from 'react-native-picker-select';
import { useRoute } from '@react-navigation/native';
import Checkbox from '../../components/Checkbox';
import { ShopDeal_t } from '../../operations/ShopDeal';
import { useTheme } from '../../contexts/ThemeContext';

type Screen3NavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen3">;

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const weekendDays = ['Sat', 'Sun'];
const daysOfWeek = weekDays.concat(weekendDays);
const hours = Array.from({ length: 24 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i.toString().padStart(2, '0') }));
const minutes = ['00', '15', '30', '45'].map(min => ({ label: min, value: min }));

export default function Screen3() {
    // Get theme
    const { theme } = useTheme();

    // Selected days and time ranges
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [timeRanges, setTimeRanges] = useState<{ [key: string]: { startHour: string, startMinute: string, endHour: string, endMinute: string } }>({});

    // Checkbox state for 'Same time every day' for multiple individual days
    const [sameTimeEveryDay, setSameTimeEveryDay] = useState<boolean>(false);

    // Show 'next' button logic
    const [showNext, setShowNext] = useState(false);

    const navigation = useNavigation<Screen3NavigationProp>();

    // Get previous parameters
    const route = useRoute();
    const {
        edit,
        dealID,
        previousDeal,
        discount,
        discountType,
        maxPoints,
    } = route.params as {
        edit: boolean,
        dealID: string | null,
        previousDeal: ShopDeal_t | null,
        discount: number,
        discountType: number,
        maxPoints: number,
    };

    // Load previous deal values if they exist
    useEffect(() => {
        if (previousDeal) {
            const discountTimes = previousDeal.discountTimes;
            const selectedDays = daysOfWeek.filter(day => {
                const dayLower = day.toLowerCase();
                return discountTimes[`${dayLower}_start` as keyof typeof discountTimes] !== null;
            });

            const timeRanges = selectedDays.reduce((acc, day) => {
                const dayLower = day.toLowerCase();

                const startTimestamp = discountTimes[`${dayLower}_start` as keyof typeof discountTimes];
                const endTimestamp = discountTimes[`${dayLower}_end` as keyof typeof discountTimes];

                const startDate = new Date(startTimestamp);
                const endDate = new Date(endTimestamp);

                acc[day] = {
                    startHour: String(startDate.getHours()).padStart(2, '0'),
                    startMinute: String(startDate.getMinutes()).padStart(2, '0'),
                    endHour: String(endDate.getHours()).padStart(2, '0'),
                    endMinute: String(endDate.getMinutes()).padStart(2, '0'),
                };

                return acc;
            }, {} as { [key: string]: { startHour: string; startMinute: string; endHour: string; endMinute: string } });

            setSelectedDays(selectedDays);
            setTimeRanges(timeRanges);
            setShowNext(selectedDays.length > 0);

            const allTimeRanges = Object.values(timeRanges);
            if (allTimeRanges.length > 0 && allTimeRanges.every(range => range.startHour === allTimeRanges[0].startHour &&
                range.startMinute === allTimeRanges[0].startMinute &&
                range.endHour === allTimeRanges[0].endHour &&
                range.endMinute === allTimeRanges[0].endMinute)) {
                if (selectedDays.length === 7) {
                    handleEverydayPress();
                    // Set the time range for 'Mon-Sun' to the same time range
                    setTimeRanges({ 'Mon-Sun': allTimeRanges[0] });
                } else if (weekDays.every(day => selectedDays.includes(day))) {
                    handleEveryWorkingDayPress();
                    // Set the time range for 'Mon-Fri' to the same time range
                    setTimeRanges({ 'Mon-Fri': allTimeRanges[0] });
                } else {
                    setSameTimeEveryDay(true);
                }
            } else {
                setSameTimeEveryDay(false);
            }
        }
    }, [previousDeal]);

    useEffect(() => {
        if (sameTimeEveryDay) {
            // When 'Same time every day' is checked, set all selected days to the same time range
            const commonRange = Object.values(timeRanges)[0] || { startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' };
            const groupedRange = selectedDays.reduce((acc, day) => {
                acc[day] = commonRange;
                return acc;
            }, {} as { [key: string]: { startHour: string, startMinute: string, endHour: string, endMinute: string } });
            setTimeRanges(groupedRange);
        }
    }, [sameTimeEveryDay, selectedDays]);

    const toggleDaySelection = (day: string) => {
        let updatedDays = [...selectedDays];
        let updatedRanges = { ...timeRanges };

        if (selectedDays.includes(day)) {
            // Unselect the day if it's already selected
            updatedDays = updatedDays.filter(d => d !== day);
            delete updatedRanges[day];

            if (updatedDays.length === 1) {
                setSameTimeEveryDay(false); // Uncheck the box if only one day is selected
            }
        } else {
            if (day === 'Mon-Fri') {
                updatedDays = ['Mon-Fri'];
                updatedRanges = {
                    'Mon-Fri': {
                        startHour: '00',
                        startMinute: '00',
                        endHour: '00',
                        endMinute: '00',
                    }
                };
            } else if (day === 'Mon-Sun') {
                updatedDays = ['Mon-Sun'];
                updatedRanges = {
                    'Mon-Sun': {
                        startHour: '00',
                        startMinute: '00',
                        endHour: '00',
                        endMinute: '00',
                    }
                };
            } else {
                updatedDays = updatedDays.filter(d => d !== 'Mon-Fri' && d !== 'Mon-Sun');
                updatedDays.push(day);
                updatedDays.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
                updatedRanges[day] = {
                    startHour: '00',
                    startMinute: '00',
                    endHour: '00',
                    endMinute: '00',
                };
            }
        }

        setSelectedDays(updatedDays);
        setTimeRanges(updatedRanges);
        setShowNext(updatedDays.length > 0);
    };

    // Update the time range for 'Mon-Fri'
    const handleEveryWorkingDayPress = () => {
        if (selectedDays.includes('Mon-Fri')) {
            setSelectedDays(selectedDays.filter(day => day !== 'Mon-Fri'));
            const updatedRanges = { ...timeRanges };
            delete updatedRanges['Mon-Fri'];
            setTimeRanges(updatedRanges);

            // Hide the next button if Mon-Fri is unselected
            setShowNext(false);
        } else {
            setSelectedDays(['Mon-Fri']);
            setTimeRanges({
                'Mon-Fri': {
                    startHour: '00',
                    startMinute: '00',
                    endHour: '00',
                    endMinute: '00',
                }
            });

            // Show the next button if Mon-Fri is selected
            setShowNext(true);
        }
        setSameTimeEveryDay(false); // Uncheck the box if Mon-Fri is selected
    };

    // Update the time range for 'Mon-Sun'
    const handleEverydayPress = () => {
        if (selectedDays.includes('Mon-Sun')) {
            setSelectedDays(selectedDays.filter(day => day !== 'Mon-Sun'));
            const updatedRanges = { ...timeRanges };
            delete updatedRanges['Mon-Sun'];
            setTimeRanges(updatedRanges);

            // Hide the next button if Mon-Sun is unselected
            setShowNext(false);
        } else {
            setSelectedDays(['Mon-Sun']);
            setTimeRanges({
                'Mon-Sun': {
                    startHour: '00',
                    startMinute: '00',
                    endHour: '00',
                    endMinute: '00',
                }
            });

            // Show the next button if Mon-Sun is selected
            setShowNext(true);
        }
        setSameTimeEveryDay(false); // Uncheck the box if Mon-Sun is selected
    };

    // Update the time range for the selected day
    const handleTimeChange = (day: string, type: 'startHour' | 'startMinute' | 'endHour' | 'endMinute', value: string) => {
        if (sameTimeEveryDay) {
            // Update time for all days when 'Same time every day' is checked
            const updatedRanges = selectedDays.reduce((acc, d) => {
                acc[d] = {
                    ...timeRanges[d],
                    [type]: value,
                };
                return acc;
            }, {} as { [key: string]: { startHour: string, startMinute: string, endHour: string, endMinute: string } });
            setTimeRanges(updatedRanges);
        } else {
            // Update time for the specific day
            const updatedRanges = {
                ...timeRanges,
                [day]: {
                    ...timeRanges[day],
                    [type]: value,
                },
            };
            setTimeRanges(updatedRanges);
        }
    };

    // Render the time pickers for each selected day
    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: Colours.outline[theme],
            borderRadius: 4,
            color: Colours.text[theme],
            width: 55,
        },
        inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: Colours.outline[theme],
            borderRadius: 4,
            color: Colours.text[theme],
            width: 55,
        },
    });

    const renderTimePickers = () => {
        if (sameTimeEveryDay) {
            const groupedDays = selectedDays.filter(day => day !== 'Mon-Fri' && day !== 'Mon-Sun');
            const displayTitle = groupedDays.length > 0 ? groupedDays.join(', ') : 'Please Select Days';
            const range = Object.values(timeRanges)[0] || { startHour: '00', startMinute: '00', endHour: '00', endMinute: '00' };

            return (
                <View style={styles.timePickerContainer}>
                    <Text style={[styles.timePickerLabel, { color: Colours.text[theme] }]}>{displayTitle}</Text>
                    <View style={styles.timePickerRow}>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange('all', 'startHour', value)}
                            items={hours}
                            value={range.startHour}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                        <Text style={[styles.timePickerColon, { color: Colours.text[theme] }]}>:</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange('all', 'startMinute', value)}
                            items={minutes}
                            value={range.startMinute}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                        <Text style={[styles.timePickerTo, { color: Colours.text[theme] }]}>to</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange('all', 'endHour', value)}
                            items={hours}
                            value={range.endHour}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                        <Text style={[styles.timePickerColon, { color: Colours.text[theme] }]}>:</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange('all', 'endMinute', value)}
                            items={minutes}
                            value={range.endMinute}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                    </View>
                </View>
            );
        } else {
            return selectedDays.map(day => (
                <View key={day} style={styles.timePickerContainer}>
                    <Text style={[styles.timePickerLabel, { color: Colours.text[theme] }]}>{day}</Text>
                    <View style={styles.timePickerRow}>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange(day, 'startHour', value)}
                            items={hours}
                            value={timeRanges[day]?.startHour || '00'}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                        <Text style={[styles.timePickerColon, { color: Colours.text[theme] }]}>:</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange(day, 'startMinute', value)}
                            items={minutes}
                            value={timeRanges[day]?.startMinute || '00'}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                        <Text style={[styles.timePickerTo, { color: Colours.text[theme] }]}>to</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange(day, 'endHour', value)}
                            items={hours}
                            value={timeRanges[day]?.endHour || '00'}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                        <Text style={[styles.timePickerColon, { color: Colours.text[theme] }]}>:</Text>
                        <RNPickerSelect
                            onValueChange={(value) => handleTimeChange(day, 'endMinute', value)}
                            items={minutes}
                            value={timeRanges[day]?.endMinute || '00'}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug={true}
                        />
                    </View>
                </View>
            ));
        }
    };

    // User pressed the next button
    const handleNext = () => {
        for (const day of selectedDays) {
            const range = timeRanges[day];
            if (parseInt(range.startHour + range.startMinute) >= parseInt(range.endHour + range.endMinute)) {
                Alert.alert('Invalid time range for ' + day);
                return;
            }
        }

        if (selectedDays.length === 0) {
            Alert.alert('Please select at least one day.');
            return;
        }

        // Change the data into the required format
        let discountTimes: { [key: string]: string | null } = {};
        if (selectedDays.includes('Mon-Fri')) {
            const range = timeRanges[selectedDays[0]];
            discountTimes = daysOfWeek.reduce((acc, day) => {
                const lowerDay = day.toLowerCase();
                if (weekDays.includes(day)) {
                    acc[`${lowerDay}_start`] = `${range.startHour}:${range.startMinute}`;
                    acc[`${lowerDay}_end`] = `${range.endHour}:${range.endMinute}`;
                } else {
                    acc[`${lowerDay}_start`] = null;
                    acc[`${lowerDay}_end`] = null;
                }
                return acc;
            }, {} as { [key: string]: string | null });
        } else if (selectedDays.includes('Mon-Sun')) {
            const range = timeRanges[selectedDays[0]];
            discountTimes = daysOfWeek.reduce((acc, day) => {
                const lowerDay = day.toLowerCase();
                acc[`${lowerDay}_start`] = `${range.startHour}:${range.startMinute}`;
                acc[`${lowerDay}_end`] = `${range.endHour}:${range.endMinute}`;
                return acc;
            }, {} as { [key: string]: string | null });
        } else {
            discountTimes = daysOfWeek.reduce((acc, day) => {
                const lowerDay = day.toLowerCase();
                if (selectedDays.includes(day)) {
                    const range = timeRanges[day];
                    acc[`${lowerDay}_start`] = `${range.startHour}:${range.startMinute}`;
                    acc[`${lowerDay}_end`] = `${range.endHour}:${range.endMinute}`;
                } else {
                    acc[`${lowerDay}_start`] = null;
                    acc[`${lowerDay}_end`] = null;
                }
                return acc;
            }, {} as { [key: string]: string | null });
        }

        // Change the time format to timetstamptz format
        const fixedDate = "1970-01-01T";
        discountTimes = Object.keys(discountTimes).reduce((acc, key) => {
            if (discountTimes[key]) {
                acc[key] = (new Date(fixedDate + discountTimes[key] + ':00')).toISOString();
            } else {
                acc[key] = null;
            }
            return acc;
        }, {} as { [key: string]: string | null });

        navigation.navigate('Screen4', {
            edit,
            dealID,
            previousDeal,
            discount,
            discountType,
            maxPoints,
            discountTimes,
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, { color: Colours.text[theme] }]}>Select Availability Times</Text>
                <Text style={styles.description}>Choose the days and times the promotion will be available.</Text>

                <View style={styles.daysContainer}>
                    <TouchableOpacity
                        style={[styles.multiDayBox, selectedDays.includes('Mon-Fri') && { backgroundColor: Colours.primary[theme] }]}
                        onPress={handleEveryWorkingDayPress}
                    >
                        <Text style={styles.dayText}>Mon-Fri</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.multiDayBox, selectedDays.includes('Mon-Sun') && { backgroundColor: Colours.primary[theme] }]}
                        onPress={handleEverydayPress}
                    >
                        <Text style={styles.dayText}>Mon-Sun</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.daysContainer}>
                    {daysOfWeek.map(day => (
                        <TouchableOpacity
                            key={day}
                            style={[styles.dayBox, selectedDays.includes(day) && !selectedDays.includes('Mon-Fri') && !selectedDays.includes('Mon-Sun') && { backgroundColor: Colours.primary[theme] }]}
                            onPress={() => toggleDaySelection(day)}
                        >
                            <Text style={[styles.dayText, selectedDays.includes(day) && !selectedDays.includes('Mon-Fri') && !selectedDays.includes('Mon-Sun') && styles.selectedDayText]}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                { // Only show the checkbox if more than one day is selected
                    !selectedDays.includes('Mon-Fri') &&
                    !selectedDays.includes('Mon-Sun') &&
                    selectedDays.length >= 2 &&
                    <Checkbox
                        label="Same time each day"
                        state={sameTimeEveryDay}
                        setState={setSameTimeEveryDay}
                    />
                }

                <ScrollView>
                    {renderTimePickers()}
                </ScrollView>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 150,
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
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dayBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colours.lightgrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    multiDayBox: {
        width: 140,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colours.lightgrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        color: Colours.darkgrey,
        fontSize: 16,
        fontFamily: Fonts.condensed,
    },
    selectedDayText: {
        color: Colours.darkgrey,
    },
    timePickerContainer: {
        marginBottom: 15,
    },
    timePickerLabel: {
        fontSize: 18,
        fontFamily: Fonts.condensed,
        marginBottom: 5,
    },
    timePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timePickerColon: {
        fontSize: 18,
        paddingHorizontal: 5,
    },
    timePickerTo: {
        fontSize: 16,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: 'white',
    },
});
