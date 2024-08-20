import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Button } from '@rneui/themed';
import Colours from '../config/Colours';
import { getShopDeals, ShopDeal_t } from '../operations/ShopDeal';
import Deal from '../components/Deal';
import { getUser } from '../operations/User';
import promptDetails from '../components/PromptDetails';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Fonts from '../config/Fonts';

export default function HomeScreen({ session }: { session: Session }) {
    const [shopName, setShopName] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [logoUrl, setLogoUrl] = useState<string>("")

    const [displayPromptDetails, setDisplayPromptDetails] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    const [deals, setDeals] = useState<ShopDeal_t[]>([])

    const navigation = useNavigation();

    const fetchDeals = async () => {
        setLoading(true);
        await getShopDeals(session, setDeals);
        setLoading(false);
    };

    // Focus Effect to fetch deals when the screen is focused
    useFocusEffect(React.useCallback(() => {
        fetchDeals()
    }, [session]))

    useEffect(() => {
        if (session) {
            getUser(session, setShopName, setLocation, setLogoUrl, setDisplayPromptDetails)
        }
    }, [session])

    useEffect(() => {
        // Make the tab bar disappear when the prompt details are displayed
        if (displayPromptDetails) {
            navigation.setOptions({
                tabBarStyle: { display: "none" }
            })
        } else {
            navigation.setOptions({
                tabBarStyle: {
                    backgroundColor: Colours.dealItem[Colours.theme], borderTopWidth: 0
                },
            })
        }
    }, [displayPromptDetails])

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Your Deals</Text>
            </View>
            <FlatList
                data={deals}
                renderItem={({ item }) => <Deal session={session} deal={item} />}
                style={styles.dealsList}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => {
                    if (loading) {
                        return (
                            <View style={styles.container}>
                                <ActivityIndicator size="large" color={Colours.primary[Colours.theme]} />
                            </View>
                        )
                    } else {
                        return (
                            <View style={styles.container}>
                                <Text style={styles.text}>No deals found.</Text>
                                <Button
                                    title="Refresh"
                                    onPress={fetchDeals}
                                    color={Colours.primary[Colours.theme]}
                                />
                            </View>
                        )
                    }
                }}
            />

            {displayPromptDetails && promptDetails(
                session,
                setDisplayPromptDetails,
                shopName,
                setShopName,
                location,
                setLocation,
                description,
                setDescription,
                logoUrl,
                setLogoUrl
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colours.background[Colours.theme],
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
        color: Colours.text[Colours.theme],
        textAlign: "center",
    },
    dealsList: {
        backgroundColor: Colours.background[Colours.theme],
    },
    headerContainer: {
        backgroundColor: Colours.background[Colours.theme],
        marginTop: 20,
        padding: 15,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: Fonts.condensed,
        color: Colours.text[Colours.theme],
        marginLeft: 10,
    },
})
