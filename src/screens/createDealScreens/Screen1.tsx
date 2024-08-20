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

type Screen1NavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen1">;

export default function Screen1() {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [maxPoints, setMaxPoints] = useState<string | null>(null);
    const animatedHeight = useRef(new Animated.Value(0)).current; // Animation value for height
    const navigation = useNavigation<Screen1NavigationProp>();

    // Get previous parameters
    const route = useRoute();
    const { previousDeal } = route.params as { previousDeal: ShopDeal_t | null };
    
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
        setShowNext(selectedType == "date" || (selectedType == "points" && parseMaxPoints()! > 0));
    }, [selectedType, maxPoints]);

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Step 1: Select Promotion Type</Text>
                <Text style={styles.description}>Choose the type of offer you would like to create.</Text>

                <TouchableOpacity
                    style={[styles.card, selectedType === 'points' && styles.selectedCard]}
                    onPress={() => handleSelection('points')}
                >
                    <Text style={styles.cardTitle}>Point-Based Discount</Text>
                    <Text style={styles.cardDescription}>For example: 10% off when you come 5 times (collect 5 points)</Text>

                    {/* Animated container for max points input */}
                    {selectedType === 'points' && (
                        <Animated.View style={[styles.dynamicInputContainer, { height: animatedHeight }]}>
                            <Text style={styles.dynamicInputLabel}>Number of points required:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter max points"
                                placeholderTextColor={Colours.bluegrey[Colours.theme]}
                                keyboardType="numeric"
                                value={maxPoints || ''}
                                onChangeText={text => setMaxPoints(text)}
                            />
                        </Animated.View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, selectedType === 'date' && styles.selectedCard]}
                    onPress={() => handleSelection('date')}
                >
                    <Text style={styles.cardTitle}>Regular Discount</Text>
                    <Text style={styles.cardDescription}>For example: 10% off</Text>
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
        backgroundColor: Colours.background[Colours.theme],
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    description: {
        fontSize: 18,
        color: Colours.bluegrey[Colours.theme],
        marginBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colours.lightgrey[Colours.theme],
        marginBottom: 20,
        backgroundColor: Colours.dealItem[Colours.theme],
    },
    selectedCard: {
        borderColor: Colours.primary[Colours.theme],
        backgroundColor: Colours.primary[Colours.theme],
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    cardDescription: {
        fontSize: 16,
        color: "#c5c5c5",
        fontWeight: "bold",
    },
    dynamicInputContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: Colours.primary[Colours.theme],
        borderRadius: 10,
    },
    dynamicInputLabel: {
        fontSize: 19,
        marginBottom: 10,
        color: Colours.text[Colours.theme],
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
        borderColor: Colours.lightgrey[Colours.theme],
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: Colours.lightgrey[Colours.theme],
        fontWeight: 'bold',
    },
})
