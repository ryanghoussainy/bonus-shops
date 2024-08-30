import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BackNextButton from '../../components/BackNextButton';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import { createDeal } from '../../operations/Deal';
import { Session } from '@supabase/supabase-js';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { useTheme } from '../../contexts/ThemeContext';

// Time formatting functions
const formatTime = (time: string | null) => {
    if (!time) return 'Not Set';
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const formatDiscountTimes = (discountTimes: { [key: string]: string | null }) => {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return days.map((day) => {
        if (!discountTimes[`${day}_start`] || !discountTimes[`${day}_end`]) {
            return `${day.charAt(0).toUpperCase()}${day.slice(1)} - Not Set`;
        }
        const start = formatTime(discountTimes[`${day}_start`]);
        const end = formatTime(discountTimes[`${day}_end`]);
        return `${day.charAt(0).toUpperCase()}${day.slice(1)} - ${start} to ${end}`;
    }).join('\n');
};

type Screen6NavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen6">;

export default function Screen6({ session }: { session: Session }) {
    // Get theme
    const { theme } = useTheme();

    const [loading, setLoading] = useState(false);

    // Modal for creating deal
    const [modalVisible, setModalVisible] = useState(false);
    
    const route = useRoute();
    const navigation = useNavigation<Screen6NavigationProp>();

    const {
        description,
        endDate,
        discountTimes,
        discount,
        discountType,
        maxPoints,
    } = route.params as {
        description: string,
        endDate: string | null,
        discountTimes: { [key: string]: string | null },
        discount: number,
        discountType: number,
        maxPoints: number,
    };

    const formatDiscountType = (type: number) => {
        switch (type) {
            case 0:
                return 'Point-Based Discount';
            case 1:
                return 'Regular Discount';
            default:
                return 'Unknown';
        }
    };

    const discountTypeText = formatDiscountType(discountType);
    const discountTimesText = formatDiscountTimes(discountTimes);

    const handleCreateDeal = async () => {
        setLoading(true);
        setModalVisible(true);
        await createDeal(
            session,
            description,
            endDate,
            discountTimes,
            discount,
            discountType,
            maxPoints,
            setLoading,
        );
        setLoading(false);
        // Show "Deal created!" message
        setTimeout(() => {
            navigation.navigate("Main", { session });
        }, 500); // 0.5 second delay before navigating
    };

    return (
        <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            <Text style={[styles.title, { color: Colours.text[theme] }]}>Summary</Text>
            <Text style={[styles.sectionContent, { fontWeight: "bold" }]}>
                Please check that your promotion details are correct. You can change them at any time.
            </Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: Colours.text[theme] }]}>Promotion Type:</Text>
                    <View style={[styles.miniDivider, { borderBottomColor: Colours.primary[theme] }]} />
                    <Text style={styles.sectionContent}>{discountTypeText}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: Colours.text[theme] }]}>Discount Amount:</Text>
                    <View style={[styles.miniDivider, { borderBottomColor: Colours.primary[theme] }]} />
                    <Text style={styles.sectionContent}>{discount}%</Text>
                </View>

                {discountType === 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: Colours.text[theme] }]}>Maximum Points to Redeem:</Text>
                        <View style={[styles.miniDivider, { borderBottomColor: Colours.primary[theme] }]} />
                        <Text style={styles.sectionContent}>{maxPoints}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: Colours.text[theme] }]}>Availability Times:</Text>
                    <View style={[styles.miniDivider, { borderBottomColor: Colours.primary[theme] }]} />
                    <Text style={styles.sectionContent}>{discountTimesText}</Text>
                </View>

                {endDate && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: Colours.text[theme] }]}>End Date:</Text>
                        <View style={[styles.miniDivider, { borderBottomColor: Colours.primary[theme] }]} />
                        <Text style={styles.sectionContent}>{new Date(endDate).toDateString()}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: Colours.text[theme] }]}>Description:</Text>
                    <View style={[styles.miniDivider, { borderBottomColor: Colours.primary[theme] }]} />
                    <Text style={styles.sectionContent}>{description}</Text>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <BackNextButton
                    onPress={() => navigation.goBack()}
                    title="Edit"
                    icon="arrow-back"
                    direction="back"
                    disabled={loading}
                />
                <BackNextButton
                    onPress={handleCreateDeal}
                    title="Create"
                    icon="checkmark-sharp"
                    direction="next"
                    disabled={loading}
                />
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: Colours.background[theme] }]}>
                        {loading ? (
                            <>
                                <ActivityIndicator size="large" color={Colours.primary[theme]} />
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>Creating Promotion...</Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>Promotion created!</Text>
                                <Text style={[styles.checkmark, { color: Colours.primary[theme] }]}>✓</Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: Fonts.condensed,
        marginTop: 40,
    },
    scrollContainer: {
        paddingBottom: 20,
        marginTop: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.condensed,
    },
    sectionContent: {
        fontSize: 18,
        color: Colours.bluegrey,
        marginTop: 5,
        fontFamily: Fonts.condensed,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    miniDivider: {
        borderBottomWidth: 1,
        width: "20%",
        marginTop: 2,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.condensed,
        marginTop: 10,
    },
    checkmark: {
        fontSize: 50,
        marginTop: 10,
    },
});
