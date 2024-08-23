import { ScrollView, StyleSheet, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';
import { Text } from '@rneui/themed';
import Colours from "../config/Colours";
import Fonts from '../config/Fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function Settings() {
    // Get theme
    const { theme } = useTheme();

    const navigation = useNavigation<SettingsScreenNavigationProp>();

    // Sign out logic
    const [modalVisible, setModalVisible] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const confirmSignOut = async () => {
        setSigningOut(true); // Show loading state
        await supabase.auth.signOut();
        setSigningOut(false); // Hide loading state
        setModalVisible(false);
    };

    const handleSignOutPress = () => {
        // Show confirmation modal
        setModalVisible(true);
    };

    return (
        <LinearGradient colors={[Colours.background[theme], Colours.dealItem[theme]]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.header, { color: Colours.text[theme] }]}>Settings</Text>

                <TouchableOpacity
                    style={[styles.option, { backgroundColor: Colours.background[theme] }]}
                    onPress={() => navigation.navigate("Account")}
                >
                    <View style={styles.optionIcon}>
                        <FontAwesome name="user-circle" size={30} color={Colours.primary[theme]} />
                    </View>
                    <Text style={[styles.optionText, { color: Colours.text[theme] }]}>Account</Text>
                    <MaterialIcons name="arrow-forward-ios" size={20} color={Colours.text[theme]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, { backgroundColor: Colours.background[theme] }]}
                    onPress={() => navigation.navigate("General")}
                >
                    <View style={styles.optionIcon}>
                        <FontAwesome name="gear" size={30} color={Colours.primary[theme]} />
                    </View>
                    <Text style={[styles.optionText, { color: Colours.text[theme] }]}> General</Text>
                    <MaterialIcons name="arrow-forward-ios" size={20} color={Colours.text[theme]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, { backgroundColor: Colours.background[theme] }]}
                    onPress={handleSignOutPress}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="log-out-outline" size={30} color={Colours.primary[theme]} />
                    </View>
                    <Text style={[styles.optionText, { color: Colours.text[theme] }]}>Sign Out</Text>
                    <MaterialIcons name="arrow-forward-ios" size={20} color={Colours.text[theme]} />
                </TouchableOpacity>
            </ScrollView>

            {/* Sign Out Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalView, { backgroundColor: Colours.background[theme] }]}>
                        {!signingOut ? (
                            <>
                                <Text style={[styles.modalTitle, { color: Colours.text[theme] }]}>Confirm Sign Out</Text>
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>Are you sure you want to sign out?</Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: Colours.dealItem[theme] }]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSignOut]}
                                        onPress={confirmSignOut}
                                    >
                                        <Text style={styles.buttonText}>Sign Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Colours.primary[theme]} />
                                <Text style={[styles.modalText, { color: Colours.text[theme], marginTop: 20 }]}>Signing out...</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: Fonts.condensed,
        textAlign: 'center',
        marginTop: 30,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    optionIcon: {
        marginRight: 15,
    },
    optionText: {
        flex: 1,
        fontSize: 18,
        fontFamily: Fonts.condensed,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: Fonts.condensed,
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        padding: 10,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    buttonSignOut: {
        backgroundColor: 'red',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontFamily: Fonts.condensed,
    },
    loadingContainer: {
        alignItems: 'center',
    },
});
