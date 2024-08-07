import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import Colours from '../config/Colours'
import getDiscountDescription from '../components/DiscountDescription';
import { RootStackParamList } from '../navigation/StackNavigator';
import Fonts from '../config/Fonts';
import { Camera, CameraView } from 'expo-camera';
import { Button } from '@rneui/themed';

type DealScreenRouteProp = RouteProp<RootStackParamList, "Deal">;

const DealScreen = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [scanned, setScanned] = useState(false)

    const route = useRoute<DealScreenRouteProp>()
    const navigation = useNavigation()
    
    const deal = route.params.deal

    useEffect(() => {
        navigation.setOptions({ title: deal.name })

        const requestCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === "granted")
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Camera permission is required to scan the QR code.")
            }
        }
        requestCameraPermission();
    }, [])

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true)
        Alert.alert("QR Code Scanned", `Type: ${type}\nData: ${data}`)
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.dealContainer}>
                {/* Discount */}
                <View>{getDiscountDescription(deal)}</View>

                {/* QR Code Scanner */}
                <View style={styles.redeem}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={styles.qrcode}
                    />
                    {scanned && <Button onPress={() => setScanned(false)}>Tap to Scan Again</Button>}
                </View>

                {/* Description */}
                <Text style={[styles.description, { textDecorationLine: "underline" }]}>
                    DETAILS
                </Text>
                <Text style={[styles.description, { paddingBottom: 15 }]}>
                    {deal.description}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background[Colours.theme],
        flex: 1,
    },
    dealContainer: {
        backgroundColor: Colours.dealItem[Colours.theme],
        flex: 1,
        marginVertical: 40,
        marginHorizontal: 30,
        borderRadius: 35,
        borderColor: Colours.green[Colours.theme],
        borderWidth: 1,
    },
    description: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
        fontSize: 15,
    },
    redeem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    qrcode: {
        width: "90%",
        height: "70%",
    },
})

export default DealScreen;
