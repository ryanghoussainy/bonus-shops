import { View, Text, StyleSheet } from 'react-native';
import colours from '../config/Colours';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { getUser, updateUser } from '../operations/User';
import { Button, Input } from '@rneui/themed';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';


export default function HomeScreen({ session }: { session: Session }) {
    const [shopName, setShopName] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [displayPrompt, setDisplayPrompt] = useState<boolean>(false)

    useEffect(() => {
        if (session) {
            getUser(session, setShopName, setLocation, setDisplayPrompt)
        }
    }, [session])

    // useEffect(() => {
    //     if (!shopName || !location) {
    //         setDisplayPrompt(true)
    //     }
    // }, [shopName, location])

    const handleSubmit = () => {
        if (shopName && location) {
            updateUser(session, shopName, location, description)
            setDisplayPrompt(false)
        }
    }

    return (
    <View style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.text}>Not Implemented!</Text>
        </View>
        {
            displayPrompt && (
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
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colours.background[colours.theme],
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
        color: colours.text[colours.theme],
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
})
