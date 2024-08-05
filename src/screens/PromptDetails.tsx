import { View, Text, StyleSheet } from 'react-native';
import colours from '../config/Colours';
import { Button, Input } from '@rneui/themed';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';
import { useState } from 'react';
import NotImplemented from './NotImplemented';

export default function PromptDetails() {
    const [shopName, setShopName] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')

    return (
    <View style={styles.container}>
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
                onPress={() => console.log('Submit')}
            />
        </View>
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
        paddingBottom: 100,
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
