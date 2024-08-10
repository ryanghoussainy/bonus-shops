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

    const resetFields = () => {
        setDealDescription("")
        setDealType(-1)
        setPercentageOff(-1)
        setStartTime("")
        setEndTime("")
        setEndDate("")
        setDaysOfWeek("")
        setMaxPoints(-1)
    }
    
    return (
    <View style={styles.container}>
        <ScrollView style={{ width: "100%" }}>
            <Input
                label="Deal Description"
                style={styles.input}
                value={dealDescription}
                onChangeText={(text) => setDealDescription(text)}
                disabled={loading}
            />
            <Input
                label="Deal type"
                style={styles.input}
                value={dealType == -1 ? "" : dealType.toString()}
                onChangeText={(text) => setDealType(parseInt(text))}
                disabled={loading}
            />
            <Input
                label="Percentage off"
                style={styles.input}
                value={percentageOff == -1 ? "" : percentageOff.toString()}
                onChangeText={(text) => setPercentageOff(parseInt(text))}
                disabled={loading}
            />
            <Input
                label="Start time"
                style={styles.input}
                value={startTime}
                onChangeText={(text) => setStartTime(text)}
                disabled={loading}
            />
            <Input
                label="End time"
                style={styles.input}
                value={endTime}
                onChangeText={(text) => setEndTime(text)}
                disabled={loading}
            />
            <Input
                label="End date"
                style={styles.input}
                value={endDate}
                onChangeText={(text) => setEndDate(text)}
                disabled={loading}
            />
            <Input
                label="Days of the week"
                style={styles.input}
                value={daysOfWeek}
                onChangeText={(text) => setDaysOfWeek(text)}
                disabled={loading}
            />
            <Input
                label="Max points"
                style={styles.input}
                value={maxPoints == -1 ? "" : maxPoints.toString()}
                onChangeText={(text) => setMaxPoints(parseInt(text))}
                disabled={loading}
            />
            <Button
                title={loading ? "Creating deal..." : "Create Deal"}
                onPress={async () => {
                    await createDeal(
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
                    );
                    resetFields();
                    setLoading(false);
                }}
                buttonStyle={styles.createDealButton}
                disabled={loading}
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
