import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import BackNextButton from '../../components/BackNextButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { useRoute } from '@react-navigation/native';
import { ShopDeal_t } from '../../operations/ShopDeal';

type Screen5NavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen5">;

export default function Screen5() {
    const [description, setDescription] = useState('');
    const navigation = useNavigation<Screen5NavigationProp>();

    // Get previous parameters
    const route = useRoute();
    const {
        previousDeal,
        endDate,
        discountTimes,
        discount,
        discountType,
        maxPoints,
    } = route.params as {
        previousDeal: ShopDeal_t | null,
        endDate: string | null,
        discountTimes: { [key: string]: string | null },
        discount: number,
        discountType: number,
        maxPoints: number,
    };

    // Load previous deal values if they exist
    useEffect(() => {
        if (previousDeal) {
            setDescription(previousDeal.description || '');
        }
    }, [previousDeal])

    // Simplified preset descriptions
    const presetDescriptions = [
        "This discount cannot be combined with other offers.",
        "Applicable only on orders over £20.",
        "Offer valid for in-store purchases only.",
        "Valid on select items only."
    ];

    const handlePresetClick = (preset: string) => {
        setDescription((prev) => (prev ? prev + ' ' + preset : preset));
    };

    const handleNext = () => {
        navigation.navigate('Screen6', {
            description,
            endDate,
            discountTimes,
            discount,
            discountType,
            maxPoints,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Step 5: Promotion Description</Text>
                <Text style={styles.description}>Add a description or any extra information about the promotion.</Text>
                
                <TextInput
                    style={styles.textInput}
                    placeholder="Write your description here..."
                    placeholderTextColor={Colours.lightgrey[Colours.theme]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.presetTitle}>Use a preset description:</Text>

                <View style={styles.presetContainer}>
                    {presetDescriptions.map((preset, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.presetButton}
                            onPress={() => handlePresetClick(preset)}
                        >
                            <Text style={styles.presetText}>{preset}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
                    disabled={!description}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colours.background[Colours.theme],
        justifyContent: 'center',
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
    textInput: {
        height: 150,
        borderColor: Colours.lightgrey[Colours.theme],
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: Colours.text[Colours.theme],
        marginBottom: 30,
        textAlignVertical: 'top',
        fontFamily: Fonts.condensed,
    },
    presetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
        marginBottom: 10,
    },
    presetContainer: {
        marginBottom: 20,
    },
    presetButton: {
        backgroundColor: Colours.dealItem[Colours.theme],
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    presetText: {
        fontSize: 16,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
