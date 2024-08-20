import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { getShopDeals, ShopDeal_t } from '../operations/ShopDeal';
import { Session } from '@supabase/supabase-js';

type CreateDealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Screen1">;

export default function CreateDealScreen({ session }: { session: Session }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingDeals, setLoadingDeals] = useState(false);
    const [deals, setDeals] = useState<ShopDeal_t[]>([]);
    const navigation = useNavigation<CreateDealScreenNavigationProp>();

    const fetchDeals = async () => {
        setLoadingDeals(true);
        await getShopDeals(session, setDeals);
        setLoadingDeals(false);
    }

    const handleLoadPreviousPromotion = async () => {
        await fetchDeals();
    };

    const handleDealSelection = (deal: ShopDeal_t) => {
        setModalVisible(false);
        navigation.navigate("Screen1", { previousDeal: deal });
    };

    const handleOpenModal = () => {
        setDeals([]); // Reset the deals when the modal opens
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <LinearGradient colors={[Colours.background[Colours.theme], Colours.dealItem[Colours.theme]]} style={styles.container}>
            <Text style={styles.header}>Create a New Deal</Text>

            <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
                <LinearGradient colors={[Colours.primary[Colours.theme], "#90EE90"]} style={styles.buttonBackground}>
                    <FontAwesome name="plus" size={50} color="white" />
                </LinearGradient>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalContent}>
                                {/* Cancel button (X) in the top right corner */}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={handleCloseModal}
                                >
                                    <FontAwesome name="times" size={24} color={Colours.text[Colours.theme]} />
                                </TouchableOpacity>

                                <Text style={styles.modalText}>Would you like to load one of your previous promotions?</Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: Colours.primary[Colours.theme] }]}
                                        onPress={handleLoadPreviousPromotion}
                                    >
                                        <Text style={styles.modalButtonText}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: Colours.dealItem[Colours.theme] }]}
                                        onPress={() => {
                                            setModalVisible(false);
                                            navigation.navigate("Screen1", { previousDeal: null }); // Navigate to the next screen without loading previous deals
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>No</Text>
                                    </TouchableOpacity>
                                </View>

                                {loadingDeals ? (
                                    <Text style={styles.loadingText}>Loading deals...</Text>
                                ) : (
                                    deals.length > 0 && (
                                        <FlatList
                                            data={deals}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={styles.dealItem}
                                                    onPress={() => handleDealSelection(item)}
                                                >
                                                    <Text style={styles.dealText}>
                                                        <Text style={styles.dealBigText}>
                                                            {item.discount}%
                                                        </Text> off
                                                        {item.discountType === 0 &&
                                                            <Text> when you come
                                                                <Text style={styles.dealBigText}> {item.maxPoints}
                                                                </Text> times
                                                            </Text>
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            style={styles.dealList}
                                            contentContainerStyle={styles.dealListContent}
                                        />
                                    )
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        color: Colours.text[Colours.theme],
        fontWeight: 'bold',
        marginBottom: 40,
        fontFamily: Fonts.condensed,
    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonBackground: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colours.background[Colours.theme],
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colours.text[Colours.theme],
        marginBottom: 20,
        fontFamily: Fonts.condensed,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 18,
        color: 'white',
        fontFamily: Fonts.condensed,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    dealList: {
        marginTop: 20,
        width: '100%',
        maxHeight: 300, // Set a maximum height for the deal list
    },
    dealListContent: {
        paddingBottom: 20, // Add some padding to the bottom of the list
    },
    dealItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colours.dealItem[Colours.theme],
    },
    dealText: {
        fontSize: 18,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    dealBigText: {
        fontSize: 23,
    },
});
