import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colours from '../config/Colours';
import { Button, Input } from '@rneui/themed';
import { createDeal } from '../operations/Deal';
import { useState } from 'react';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';

export default function CreateDealScreen({ session }: { session: any }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [dealDescription, setDealDescription] = useState<string>("")
    const [dealType, setDealType] = useState<number>(-1)
    const [percentageOff, setPercentageOff] = useState<number>(-1)
    const [startTime, setStartTime] = useState<string>("")
    const [endTime, setEndTime] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [daysOfWeek, setDaysOfWeek] = useState<string>("")
    const [maxPoints, setMaxPoints] = useState<number>(-1)
    
    return (
    <View style={styles.container}>
        <ScrollView style={{ width: "100%" }}>
            <Input
                label="Deal Description"
                style={styles.input}
                onChangeText={(text) => setDealDescription(text)}
            />
            <Input
                label="Deal type"
                style={styles.input}
                onChangeText={(text) => setDealType(parseInt(text))}
            />
            <Input
                label="Percentage off"
                style={styles.input}
                onChangeText={(text) => setPercentageOff(parseInt(text))}
            />
            <Input
                label="Start time"
                style={styles.input}
                onChangeText={(text) => setStartTime(text)}
            />
            <Input
                label="End time"
                style={styles.input}
                onChangeText={(text) => setEndTime(text)}
            />
            <Input
                label="End date"
                style={styles.input}
                onChangeText={(text) => setEndDate(text)}
            />
            <Input
                label="Days of the week"
                style={styles.input}
                onChangeText={(text) => setDaysOfWeek(text)}
            />
            <Input
                label="Max points"
                style={styles.input}
                onChangeText={(text) => setMaxPoints(parseInt(text))}
            />
            <Button
                title="Create Deal"
                onPress={() => createDeal(
                    session,
                    dealDescription,
                    dealType,
                    percentageOff,
                    startTime,
                    endTime,
                    endDate,
                    daysOfWeek,
                    setLoading,
                    maxPoints
                )}
                buttonStyle={styles.createDealButton}
            />
        </ScrollView>
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
    input: {
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
    },
    createDealButton: {
        backgroundColor: Colours.green[Colours.theme],
        width: "50%",
        alignSelf: "flex-end",
    },
})
