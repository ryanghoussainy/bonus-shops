import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import { Session } from '@supabase/supabase-js';
import { getUser, updateUser } from '../../operations/User';
import { useTheme } from '../../contexts/ThemeContext';

export default function Account({ session }: { session: Session }) {
    // Get theme
    const { theme } = useTheme();

    const navigation = useNavigation();

    // Account details
    const [shopName, setShopName] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState("");

    // Loading for getting user
    const [loading, setLoading] = useState(true);

    // Loading for saving user
    const [loadingSave, setLoadingSave] = useState(false);

    // Fetch user from backend
    useEffect(() => {
        if (session) getUser(session, setShopName, setLocation, setDescription, setMobileNumber, setLoading);
    }, [session]);

    const handleSave = () => {
        if (!shopName || !location || !description) {
            Alert.alert("Please fill in all required fields.");
            return;
        }
        // Update user details
        updateUser(session, shopName, location, description, mobileNumber, setLoadingSave);
    };

    return (
        <LinearGradient colors={[Colours.background[theme], Colours.dealItem[theme]]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: Colours.background[theme] }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back-outline" size={28} color={Colours.text[theme]} />
            </TouchableOpacity>

            {loading ? (
                // Show loading indicator when fetching user data
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colours.primary[theme]} />
                    <Text style={[styles.loadingText, { color: Colours.text[theme] }]}>Loading your account details...</Text>
                </View>
            ) : (
                // Show account details form when data is loaded
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={[styles.header, { color: Colours.text[theme] }]}>Account</Text>

                    <View style={styles.fieldContainer}>
                        <Text style={[styles.label, { color: Colours.text[theme] }]}>Email *</Text>
                        <View style={[styles.readOnlyField, { backgroundColor: Colours.dealItem[theme] }]}>
                            <Text style={[styles.readOnlyText, { color: Colours.text[theme] }]}>{session.user.email}</Text>
                        </View>
                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={[styles.label, { color: Colours.text[theme] }]}>Name *</Text>
                        <TextInput
                            style={[styles.inputField, {
                                backgroundColor: Colours.background[theme],
                                color: Colours.text[theme],
                                borderColor: Colours.dealItem[theme]
                            }]}
                            value={shopName}
                            onChangeText={setShopName}
                            placeholder="Enter the Shop Name"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={[styles.label, { color: Colours.text[theme] }]}>Location *</Text>
                        <TextInput
                            style={[styles.inputField, {
                                backgroundColor: Colours.background[theme],
                                color: Colours.text[theme],
                                borderColor: Colours.dealItem[theme]
                            }]}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Enter your location"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={[styles.label, { color: Colours.text[theme] }]}>Description *</Text>
                        <TextInput
                            style={[styles.inputField, {
                                backgroundColor: Colours.background[theme],
                                color: Colours.text[theme],
                                borderColor: Colours.dealItem[theme]
                            }]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter your description"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={[styles.label, { color: Colours.text[theme] }]}>Mobile Number *</Text>
                        <TextInput
                            style={[styles.inputField, {
                                backgroundColor: Colours.background[theme],
                                color: Colours.text[theme],
                                borderColor: Colours.dealItem[theme]
                            }]}
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            placeholder="Enter your mobile number"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loadingSave}>
                        <LinearGradient colors={[Colours.primary[theme], Colours.lightprimary[theme]]} style={styles.buttonBackground}>
                            <Text style={styles.saveButtonText}>{loadingSave ? "Saving..." : "Save changes"}</Text>
                            <Ionicons name="save-outline" size={24} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            )}
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
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1,
        borderRadius: 20,
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontFamily: Fonts.condensed,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        fontFamily: Fonts.condensed,
        textAlign: 'center',
        marginTop: 30,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontFamily: Fonts.condensed,
        marginBottom: 5,
    },
    readOnlyField: {
        padding: 15,
        borderRadius: 10,
    },
    readOnlyText: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
    },
    inputField: {
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        fontFamily: Fonts.condensed,
        borderWidth: 1,
    },
    saveButton: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBackground: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        color: 'white',
        fontFamily: Fonts.condensed,
        marginRight: 10,
    },
});
