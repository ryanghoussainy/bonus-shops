import { StyleSheet, Text, View } from "react-native";
import { ShopDeal_t } from "../operations/ShopDeal";
import Colours from "../config/Colours";
import Fonts from "../config/Fonts";
import { Button, Input } from "@rneui/themed";
import { updateUser } from "../operations/User";
import { Session } from "@supabase/supabase-js";


export default function promptDetails(
    session: Session,
    setDisplayPromptDetails: (display: boolean) => void,
    shopName: string,
    setShopName: (shopName: string) => void,
    location: string,
    setLocation: (location: string) => void,
    description: string,
    setDescription: (description: string) => void
) {
    const handleSubmit = () => {
        if (shopName && location) {
            updateUser(session, shopName, location, description)
            setDisplayPromptDetails(false)
        }
    }

    return (
        <View style={styles.promptDetailsView}>
        <Text style={styles.text}>Please enter the following:</Text>
        <View style={styles.inputView}>
            <Input
                label="Shop Name"
                style={styles.input}
                onChangeText={(text) => setShopName(text)}
            />
        </View>
        <View style={styles.inputView}>
            <Input
                label="Location on campus (be brief but specific)"
                placeholder="e.g. Senior Common Room"
                style={styles.input}
                onChangeText={(text) => setLocation(text)}
            />
        </View>
        <View style={styles.inputView}>
            <Input
                label="Description of the shop (optional but recommended)"
                placeholder="e.g. We sell snacks and drinks."
                style={styles.input}
                onChangeText={(text) => setDescription(text)}
            />
        </View>

        <View style={styles.alignRight}>
            <Button
                buttonStyle={styles.submitButton}
                title="Submit"
                disabled={!shopName || !location}
                disabledStyle={{ backgroundColor: Colours.background[Colours.theme] }}
                disabledTitleStyle={{ color: Colours.background[Colours.theme] }}
                onPress={handleSubmit}
            />
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: "500",
        color: Colours.text[Colours.theme],
        textAlign: "center",
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
        paddingVertical: 15,
    },
    submitButton: {
        backgroundColor: Colours.green[Colours.theme],
        marginTop: 40,
    },
    alignRight: {
        alignSelf: "flex-end",
        paddingRight: 20,
    },
});
