import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { Button } from '@rneui/themed';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';
import { useTheme } from '../contexts/ThemeContext';
import { Session } from '@supabase/supabase-js';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { getLogo } from '../operations/Logo';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { checkValidUser } from '../operations/User';
import { isAfter } from 'date-fns';
import { addPoint, getUserDeal } from '../operations/UserDeal';
import { deleteDeal, disableDeal, enableDeal } from '../operations/Deal';
import { TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Divider, IconButton, Menu } from 'react-native-paper';

type DealScreenRouteProp = RouteProp<RootStackParamList, 'Deal'>;
type DealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Deal'>;

export default function DealScreen({ session }: { session: Session }) {
    const { theme } = useTheme();
    const route = useRoute<DealScreenRouteProp>();
    const deal = route.params.deal;

    // Logo
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

    const navigation = useNavigation<DealScreenNavigationProp>();

    // Loading for deleting/disabling deal
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLogo(deal.logoUrl, setLogoUrl);
    }, [session]);

    // Format Time
    const formatTime = (time: string | null) => {
        if (!time) return '';
        const date = new Date(time);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Format Discount Times
    const formatDiscountTimes = (discountTimes: { [key: string]: string | null }) => {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return days
            .map((day) => {
                if (!discountTimes[`${day}_start`] || !discountTimes[`${day}_end`]) return null;
                const start = formatTime(discountTimes[`${day}_start`]);
                const end = formatTime(discountTimes[`${day}_end`]);
                return `${day.charAt(0).toUpperCase()}${day.slice(1)} - ${start} to ${end}`;
            })
            .filter(Boolean)
            .join('\n');
    };
    
    // Delete Modal
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletingModalVisible, setDeletingModalVisible] = useState(false);

    const handleDeleteDeal = async () => {
        setDeleteModalVisible(false);
        setDeletingModalVisible(true);
        
        // Delete/disable deal
        await deleteDeal(deal.id, setLoading);
        
        setTimeout(() => {
            navigation.navigate("Main", { session });
        }, 500); // 0.5 second delay before navigating
    }

    // Disable Modal
    const [disableModalVisible, setDisableModalVisible] = useState(false);
    const [disablingModalVisible, setDisablingModalVisible] = useState(false);

    const handleDisableDeal = async () => {
        setDisableModalVisible(false);
        setDisablingModalVisible(true);
        
        // Disable deal
        await disableDeal(deal.id, setLoading);
        
        setTimeout(() => {
            navigation.navigate("Main", { session });
        }, 500); // 0.5 second delay before navigating
    }
    
    // Enable Deal
    const [enablingModalVisible, setEnablingModalVisible] = useState(false);

    const handleEnableDeal = async () => {
        setEnablingModalVisible(true);
        
        // Enable deal
        await enableDeal(deal.id, setLoading);
        
        setTimeout(() => {
            navigation.navigate("Main", { session });
        }, 500); // 0.5 second delay before navigating
    }

    // Camera Permissions and QR Code Scanning
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [redeemedDays, setRedeemedDays] = useState<string[]>([]);
    const [userID, setUserID] = useState<string | null>(null);
    const [userDealID, setUserDealID] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const requestCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Camera permission is required to scan the QR code.');
            }
        };
        requestCameraPermission();
    }, []);

    useEffect(() => {
        if (userID === null || userDealID === null) return;

        // Check if the user is valid
        if (!checkValidUser(userID)) {
            Alert.alert('Invalid User', 'You are not a valid user for this deal.');
            return;
        }

        // Check if already redeemed today
        if (redeemedDays.includes(new Date().toISOString().split('T')[0])) {
            Alert.alert('Already Redeemed', 'You have already redeemed this deal today.');
            return;
        }

        // Check if the day of the week is valid in london time
        let shortToday = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', weekday: 'short' }).toLowerCase();
        if (!deal.discountTimes[`${shortToday}_start` as keyof typeof deal.discountTimes] || 
            !deal.discountTimes[`${shortToday}_end` as keyof typeof deal.discountTimes]
        ) {
            Alert.alert('Outside Deal Time', 'This deal is not valid today.');
            return;
        }

        // Check if time is within deal time
        const time = new Date().toISOString().split('T')[1];
        const startTime = deal.discountTimes[`${shortToday}_start` as keyof typeof deal.discountTimes];
        const endTime = deal.discountTimes[`${shortToday}_end` as keyof typeof deal.discountTimes];
        if (time < startTime || time > endTime) {
            Alert.alert('Outside Deal Time', 'This deal is not valid right now.');
            return;
        }

        // Check that the deal is not expired
        if (deal.endDate && isAfter(new Date(), new Date(deal.endDate))) {
            Alert.alert('Deal Expired', 'This deal has expired.');
            return;
        }

        // Add 1 point
        addPoint(userDealID);

        Alert.alert('Deal Redeemed', 'You have successfully redeemed this deal.');
    }, [userID, redeemedDays, userDealID]);

    const checkQRCode = async (userDealID: string) => {
        setScanned(true);
        setUserDealID(userDealID);
        await getUserDeal(userDealID, setRedeemedDays, setUserID);
    };

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (!scanned) {
            checkQRCode(data);
        }
    };

    // Check camera permissions
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // Three Dots Menu
    const ThreeDotsMenu = () => {
        const [visible, setVisible] = useState(false);

        const openMenu = () => setVisible(true);
        const closeMenu = () => setVisible(false);

        return (
            <View style={{
                position: "absolute",
                top: 60,
                right: 5,
                width: 45,
                height: 45,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <IconButton
                            icon={() => (
                                <Ionicons name="ellipsis-vertical" size={24} color={Colours.text[theme]} />
                            )}
                            onPress={openMenu}
                        />
                    }
                    contentStyle={{
                        backgroundColor: Colours.background[theme],
                        padding: 5,
                        borderRadius: 15,
                        borderColor: Colours.dealItem[theme],
                        borderWidth: 1,
                    }}
                >
                    <Menu.Item
                        onPress={() => {
                            if (!deal.disabled) {
                                setDisableModalVisible(true);
                            } else {
                                handleEnableDeal();
                            }
                        }}
                        title={deal.disabled ? "Enable" : "Disable"}
                        titleStyle={{ color: Colours.text[theme] }}
                    />
                    <Divider />
                    <Menu.Item onPress={() => setDeleteModalVisible(true)} title="Delete" titleStyle={{ color: Colours.text[theme] }} />
                </Menu>
            </View>
        )
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: Colours.background[theme] }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back-outline" size={28} color={Colours.text[theme]} />
            </TouchableOpacity>

            {/* Three Dots Menu */}
            <ThreeDotsMenu />

            <View style={styles.headerContainer}>
                <Image source={{ uri: logoUrl }} style={styles.logo} />
                <Text style={[styles.shopName, { color: Colours.text[theme] }]}>{deal.name}</Text>
                <Text style={[styles.shopLocation, { color: Colours.text[theme] }]}>{deal.location}</Text>
            </View>

            <View style={styles.qrContainer}>
                <Button buttonStyle={styles.scanButton} onPress={() => setModalVisible(true)}>Scan QR Code</Button>
            </View>

            <View style={styles.dealInfoContainer}>
                <Text style={[styles.sectionTitle, { color: Colours.primary[theme] }]}>Description</Text>
                <Text style={[styles.dealDescription, { color: Colours.text[theme] }]}>{deal.description}</Text>
                <Text style={[styles.sectionTitle, { color: Colours.primary[theme] }]}>This deal is available on:</Text>
                <Text style={[styles.dealTimes, { color: Colours.text[theme] }]}>{formatDiscountTimes(deal.discountTimes)}</Text>
            </View>

            {/* Modal for QR Code Scanner */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                    {scanned && (
                        <Button
                            title="Tap to Scan Again"
                            onPress={() => setScanned(false)}
                            buttonStyle={styles.scanAgainButton}
                        />
                    )}
                    <TouchableOpacity
                        style={[styles.closeScannerButtonContainer, { backgroundColor: Colours.background[theme] }]}
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons name="close" size={28} color={Colours.text[theme]} />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal
                visible={deleteModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={[styles.modalContent, { backgroundColor: Colours.background[theme] }]}>
                                {/* Cancel button (X) in the top right corner */}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setDeleteModalVisible(false)}
                                >
                                    <FontAwesome name="times" size={24} color={Colours.text[theme]} />
                                </TouchableOpacity>

                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Are you sure you want to delete this promotion?
                                </Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: Colours.dealItem[theme] }]}
                                        onPress={() => setDeleteModalVisible(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: "red" }]}
                                        onPress={handleDeleteDeal}
                                    >
                                        <Text style={styles.modalButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal for Disable Confirmation */}
            <Modal
                visible={disableModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDisableModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setDisableModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={[styles.modalContent, { backgroundColor: Colours.background[theme] }]}>
                                {/* Cancel button (X) in the top right corner */}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setDisableModalVisible(false)}
                                >
                                    <FontAwesome name="times" size={24} color={Colours.text[theme]} />
                                </TouchableOpacity>

                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Are you sure you want to disable this promotion?
                                </Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: Colours.dealItem[theme] }]}
                                        onPress={() => setDisableModalVisible(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: Colours.primary[theme] }]}
                                        onPress={handleDisableDeal}
                                    >
                                        <Text style={styles.modalButtonText}>Disable</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal for deleting modal */}
            <Modal
                visible={deletingModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDeletingModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: Colours.background[theme] }]}>
                        {loading ? (
                            <>
                                <ActivityIndicator size="large" color={Colours.primary[theme]} />
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Deleting promotion...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Promotion deleted successfully!
                                </Text>
                                <Text style={[styles.checkmark, { color: Colours.primary[theme] }]}>✓</Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            
            {/* Modal for disabling modal */}
            <Modal
                visible={disablingModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDisablingModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: Colours.background[theme] }]}>
                        {loading ? (
                            <>
                                <ActivityIndicator size="large" color={Colours.primary[theme]} />
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Disabling promotion...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Promotion disabled successfully!
                                </Text>
                                <Text style={[styles.checkmark, { color: Colours.primary[theme] }]}>✓</Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal for enabling modal */}
            <Modal
                visible={enablingModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEnablingModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: Colours.background[theme] }]}>
                        {loading ? (
                            <>
                                <ActivityIndicator size="large" color={Colours.primary[theme]} />
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Enabling promotion...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.modalText, { color: Colours.text[theme] }]}>
                                    Promotion Enabled successfully!
                                </Text>
                                <Text style={[styles.checkmark, { color: Colours.primary[theme] }]}>✓</Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        zIndex: 1,
        borderRadius: 20,
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: Colours.background.light,
    },
    shopName: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.condensed,
    },
    shopLocation: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
        color: Colours.grey,
        marginBottom: 10,
    },
    dealInfoContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: Fonts.condensed,
    },
    dealDescription: {
        fontSize: 18,
        fontFamily: Fonts.condensed,
        marginBottom: 15,
    },
    dealTimes: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
        marginBottom: 15,
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: Fonts.condensed,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    scanButton: {
        width: 200,
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colours.primary.dark,
    },
    scanAgainButton: {
        marginTop: 20,
        backgroundColor: Colours.primary.dark,
    },
    closeScannerButtonContainer: {
        position: 'absolute',
        top: 30,
        right: 20,
        zIndex: 1,
        borderRadius: 20,
        padding: 10,
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
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: Fonts.condensed,
        textAlign: 'center',
    },
    checkmark: {
        fontSize: 50,
        marginTop: 10,
    },
});
