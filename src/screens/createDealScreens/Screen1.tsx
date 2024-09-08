import { Alert, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import BackNextButton from '../../components/BackNextButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { useRoute } from '@react-navigation/native';
import { ShopDeal_t } from '../../operations/ShopDeal';
import { useTheme } from '../../contexts/ThemeContext';

type Screen1NavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen1">;

export default function Screen1() {
    // Get theme
    const { theme } = useTheme();

    // Deal type selection
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Maximum number of points if type is "points"
    const [maxPoints, setMaxPoints] = useState<string | null>(null);

    // Animation for max points input
    const animatedHeight = useRef(new Animated.Value(0)).current; // Animation value for height

    const navigation = useNavigation<Screen1NavigationProp>();

    // Get previous parameters
    const route = useRoute();
    const { edit, dealID, previousDeal } = route.params as {
        edit: boolean,
        dealID: string | null,
        previousDeal: ShopDeal_t | null
    };

    // Load previous deal values if they exist
    useEffect(() => {
        if (previousDeal) {
            handleSelection(previousDeal.discountType === 0 ? 'points' : 'date');
            setMaxPoints(previousDeal.maxPoints?.toString() || null);
        }
    }, [previousDeal])

    const expandCard = (type: string) => {
        if (type === 'points') {
            // Reset animation value
            animatedHeight.setValue(0);
            // Animate expansion if "points" is selected
            Animated.timing(animatedHeight, {
                toValue: 100, // Height when expanded
                duration: 300, // Animation duration in ms
                useNativeDriver: false,
            }).start();
        } else {
            // Animate collapse if "date" is selected
            Animated.timing(animatedHeight, {
                toValue: 0, // Height when collapsed
                duration: 300, // Animation duration in ms
                useNativeDriver: false,
            }).start();
        }
    };

    const parseMaxPoints = () => {
        return maxPoints ? parseInt(maxPoints) : null;
    }

    const handleSelection = (type: string) => {
        if (type === selectedType) {
            return; // Do nothing if already selected
        }

        setSelectedType(type);
        expandCard(type);
    };

    const handleNext = () => {
        if (selectedType === 'points' && (!maxPoints || parseInt(maxPoints) <= 0)) {
            Alert.alert('Invalid Input', 'Please enter a valid number of points.');
            return;
        }

        if (selectedType) {
            navigation.navigate("Screen2", {
                edit,
                dealID,
                previousDeal,
                discountType: selectedType === 'points' ? 0 : 1,
                maxPoints: parseMaxPoints(),
            });
        } else {
            Alert.alert('Selection Required', 'Please select a discount type.');
        }
    };

    // Make sure only valid numbers are entered
    useEffect(() => {
        if (maxPoints && isNaN(parseInt(maxPoints))) {
            setMaxPoints(null);
        } else if (maxPoints && (maxPoints.includes('-') || maxPoints.includes('.') || maxPoints.includes(','))) {
            setMaxPoints(maxPoints.replace(/[-.,]/g, ''));
        }
    }, [maxPoints])

    // Show the next button when a type is selected
    const [showNext, setShowNext] = useState(false);

    useEffect(() => {
        setShowNext(selectedType == "date" || (selectedType == "points" && parseMaxPoints()! > 1));
    }, [selectedType, maxPoints]);

    return (
        <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, { color: Colours.text[theme] }]}>Step 1: Select Promotion Type</Text>
                <Text style={styles.description}>Choose the type of offer you would like to create.</Text>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: Colours.dealItem[theme] }, selectedType === 'points' && { borderColor: Colours.primary[theme], backgroundColor: Colours.primary[theme] }]}
                    onPress={() => handleSelection('points')}
                >
                    <Text style={[styles.cardTitle, { color: Colours.text[theme] }]}>Point-Based Discount</Text>
                    <Text style={[styles.cardDescription, { color: Colours.outline[theme] }]}>For example: 10% off when you come 5 times (collect 5 points)</Text>

                    {/* Animated container for max points input */}
                    {selectedType === 'points' && (
                        <Animated.View style={[styles.dynamicInputContainer, { height: animatedHeight, backgroundColor: Colours.primary[theme] }]}>
                            <Text style={[styles.dynamicInputLabel, { color: Colours.text[theme] }]}>Number of points required:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter max points"
                                placeholderTextColor={Colours.bluegrey}
                                keyboardType="numeric"
                                value={maxPoints || ''}
                                onChangeText={text => setMaxPoints(text)}
                            />
                        </Animated.View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: Colours.dealItem[theme] }, selectedType === 'date' && { borderColor: Colours.primary[theme], backgroundColor: Colours.primary[theme] }]}
                    onPress={() => handleSelection('date')}
                >
                    <Text style={[styles.cardTitle, { color: Colours.text[theme] }]}>Regular Discount</Text>
                    <Text style={[styles.cardDescription, { color: Colours.outline[theme] }]}>For example: 10% off</Text>
                </TouchableOpacity>
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
    card: {
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colours.lightgrey,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: Fonts.condensed,
    },
    cardDescription: {
        fontSize: 16,
        fontWeight: "bold",
    },
    dynamicInputContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
    },
    dynamicInputLabel: {
        fontSize: 19,
        marginBottom: 10,
        fontFamily: Fonts.condensed,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: Colours.lightgrey,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: Colours.lightgrey,
        fontWeight: 'bold',
    },
})
