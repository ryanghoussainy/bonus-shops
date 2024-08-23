import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import Colours from '../config/Colours';
import { RootStackParamList } from '../navigation/StackNavigator';
import Fonts from '../config/Fonts';
import { Camera, CameraView } from 'expo-camera';
import { Button, Image } from '@rneui/themed';
import { addPoint, getUserDeal } from '../operations/UserDeal';
import { checkValidUser } from '../operations/User';
import { getLogo, getLogoPath } from '../operations/Logo';
import { Session } from '@supabase/supabase-js';
import { useTheme } from '../contexts/ThemeContext';
import { isAfter } from 'date-fns';

type DealScreenRouteProp = RouteProp<RootStackParamList, "Deal">;

const DealScreen = ({ session }: { session: Session }) => {
    // Get theme
    const { theme } = useTheme();

    // Update the title of the screen
    const route = useRoute<DealScreenRouteProp>()
    const navigation = useNavigation()

    const deal = route.params.deal

    useLayoutEffect(() => {
        navigation.setOptions({ title: deal.name })
    }, [])

    // Camera Permissions and QR Code Scanning
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [scanned, setScanned] = useState(false)
    const [redeemedDays, setRedeemedDays] = useState<string[]>([]);
    const [userID, setUserID] = useState<string | null>(null);
    const [userDealID, setUserDealID] = useState<string | null>(null);

    useEffect(() => {
        const requestCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === "granted")
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Camera permission is required to scan the QR code.")
            }
        }
        requestCameraPermission();
    })

    useEffect(() => {
        if (userID === null || userDealID === null) return;

        // Check if the user is valid
        if (!checkValidUser(userID)) {
            Alert.alert("Invalid User", "You are not a valid user for this deal.");
            return;
        }

        // Check if already redeemed today
        if (redeemedDays.includes(new Date().toISOString().split("T")[0])) {
            Alert.alert("Already Redeemed", "You have already redeemed this deal today.");
            return;
        }

        // Check if the day of the week is valid in london time
        let shortToday = new Date().toLocaleString("en-GB", { timeZone: "Europe/London", weekday: "short" }).toLowerCase();
        if (!deal.discountTimes[shortToday + "_start" as keyof typeof deal.discountTimes] || !deal.discountTimes[shortToday + "_end" as keyof typeof deal.discountTimes]) {
            Alert.alert("Outside Deal Time", "This deal is not valid today.");
            return;
        }

        // Check if time is within deal time
        const time = new Date().toISOString().split("T")[1];
        const startTime = deal.discountTimes[shortToday + "_start" as keyof typeof deal.discountTimes] as string;
        const endTime = deal.discountTimes[shortToday + "_end" as keyof typeof deal.discountTimes] as string;
        if (time < startTime || time > endTime) {
            Alert.alert("Outside Deal Time", "This deal is not valid right now.");
            return;
        }

        // Check that the deal is not expired
        if (deal.endDate && isAfter(new Date(), new Date(deal.endDate))) {
            Alert.alert("Deal Expired", "This deal has expired.");
            return;
        }

        // Add 1 point
        addPoint(userDealID);

        Alert.alert("Deal Redeemed", "You have successfully redeemed this deal.");
    }, [userID, redeemedDays, userDealID])

    const checkQRCode = async (userDealID: string) => {
        setScanned(true);
        setUserDealID(userDealID);
        await getUserDeal(userDealID, setRedeemedDays, setUserID);
    };

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        if (!scanned) {
            checkQRCode(data);
        }
    }

    // Get logo
    const [url, setUrl] = useState<string>("");
    const [logoUrl, setLogoUrl] = useState<string>("");

    useEffect(() => {
        if (url) getLogo(url, setLogoUrl);
    }, [url])

    useEffect(() => {
        getLogoPath(session, setUrl);
    }, [session])

    // Check camera permissions
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            <View style={[styles.dealContainer, { backgroundColor: Colours.dealItem[theme], borderColor: Colours.primary[theme] }]}>
                {/* Logo */}
                {logoUrl &&
                    <Image
                        source={{ uri: logoUrl }}
                        accessibilityLabel="Logo"
                        style={styles.logo}
                        resizeMode="cover"
                    />
                }

                {/* QR Code Scanner */}
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.qrcode}
                />
                {scanned && <Button onPress={() => setScanned(false)}>Tap to Scan Again</Button>}


                {/* Description */}
                <Text style={[styles.description, { textDecorationLine: "underline", color: Colours.text[theme] }]}>
                    DETAILS
                </Text>
                <Text style={[styles.description, { paddingBottom: 15, color: Colours.text[theme] }]}>
                    {deal.description}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dealContainer: {
        flex: 1,
        marginVertical: 40,
        marginHorizontal: 30,
        borderRadius: 35,
        borderWidth: 1,
        alignItems: "center",
    },
    description: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontFamily: Fonts.condensed,
        fontSize: 15,
    },
    qrcode: {
        width: "90%",
        height: "40%",
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 25,
    },
})

export default DealScreen;
