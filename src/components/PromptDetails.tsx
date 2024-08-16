import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import Colours from "../config/Colours";
import Fonts from "../config/Fonts";
import { Button, Input } from "@rneui/themed";
import { updateUser } from "../operations/User";
import { Session } from "@supabase/supabase-js";
import Logo from "./Logos";
import { getShopNames } from "../operations/Shop";


export default function promptDetails(
    session: Session,
    setDisplayPromptDetails: (display: boolean) => void,
    shopName: string,
    setShopName: (shopName: string) => void,
    location: string,
    setLocation: (location: string) => void,
    description: string,
    setDescription: (description: string) => void,
    logoUrl: string,
    setLogoUrl: (url: string) => void
) {
    const handleSubmit = async () => {
        // Check that shop name is unique
        const shops = await getShopNames();

        if (shops.map(shop => shop.name).includes(shopName)) {
            // Alert user that the shop name is already taken
            Alert.alert("Shop name already taken", "Please choose a different name.")
            return
        }

        // Check that all mandatory fields are filled in
        if (shopName && location && logoUrl) {
            updateUser(session, shopName, location, description, logoUrl)
            setDisplayPromptDetails(false)
        }
    }

    return (
    <KeyboardAvoidingView
        style={styles.promptDetailsView}
        behavior="height"
    >
        <ScrollView>
            <Text style={styles.text}>Please enter the following:</Text>
            <View style={styles.inputView}>
                <Input
                    label="Shop Name"
                    labelStyle={styles.label}
                    style={styles.input}
                    onChangeText={(text) => setShopName(text)}
                />
            </View>
            <View style={styles.inputView}>
                <Input
                    label="Location on campus (be brief but specific)"
                    labelStyle={styles.label}
                    placeholder="e.g. Senior Common Room"
                    style={styles.input}
                    onChangeText={(text) => setLocation(text)}
                />
            </View>
            <View style={styles.inputView}>
                <Input
                    label="Description of the shop (optional but recommended)"
                    labelStyle={styles.label}
                    placeholder="e.g. We sell snacks and drinks."
                    style={styles.input}
                    onChangeText={(text) => setDescription(text)}
                />
            </View>
            <View style={styles.alignLeft}>
                <Text style={styles.label}>Your logo:</Text>
                <Logo
                    size={200}
                    url={logoUrl}
                    onUpload={(url: string) => setLogoUrl(url)}
                />
            </View>

            <View style={styles.alignRight}>
                <Button
                    buttonStyle={styles.submitButton}
                    title="Submit"
                    disabled={!shopName || !location || !logoUrl}
                    disabledStyle={{ backgroundColor: Colours.background[Colours.theme] }}
                    disabledTitleStyle={{ color: Colours.background[Colours.theme] }}
                    onPress={handleSubmit}
                />
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: "500",
        color: Colours.text[Colours.theme],
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "800",
        color: Colours.bluegrey[Colours.theme],
        marginBottom: 10,
    },
    promptDetailsView: {
        position: "absolute",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colours.background[Colours.theme],
        width: "100%",
        height: "100%",
    },
    input: {
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    inputView: {
        alignSelf: "stretch",
        paddingVertical: 5,
    },
    submitButton: {
        backgroundColor: Colours.green[Colours.theme],
        marginTop: 40,
    },
    alignRight: {
        alignSelf: "flex-end",
        paddingRight: 20,
    },
    alignLeft: {
        alignSelf: "flex-start",
        paddingLeft: 10,
    },
});
