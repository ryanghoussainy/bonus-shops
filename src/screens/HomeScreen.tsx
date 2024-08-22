import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { useCallback, useState } from 'react';
import { Button } from '@rneui/themed';
import Colours from '../config/Colours';
import { getShopDeals, ShopDeal_t } from '../operations/ShopDeal';
import Deal from '../components/Deal';
import { useFocusEffect } from '@react-navigation/native';
import Fonts from '../config/Fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen({ session }: { session: Session }) {
    // Get theme
    const { theme } = useTheme();

    const [loading, setLoading] = useState<boolean>(true)

    const [deals, setDeals] = useState<ShopDeal_t[]>([])

    const fetchDeals = async () => {
        setLoading(true);
        await getShopDeals(session, setDeals);
        setLoading(false);
    };

    // Focus Effect to fetch deals when the screen is focused
    useFocusEffect(useCallback(() => {
        fetchDeals()
    }, [session]))

    return (
        <LinearGradient style={{ flex: 1 }} colors={[Colours.background[theme], Colours.dealItem[theme]]}>
            <View style={[styles.headerContainer, { backgroundColor: Colours.background[theme] }]}>
                <Text style={[styles.header, { color: Colours.text[theme] }]}>Your Deals</Text>
            </View>
            <FlatList
                data={deals}
                renderItem={({ item }) => <Deal session={session} deal={item} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => {
                    if (loading) {
                        return (
                            <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
                                <ActivityIndicator size="large" color={Colours.primary} />
                            </View>
                        )
                    } else {
                        return (
                            <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
                                <Text style={[styles.text, { color: Colours.text[theme] }]}>No deals found.</Text>
                                <Button
                                    title="Refresh"
                                    onPress={fetchDeals}
                                    color={Colours.primary}
                                />
                            </View>
                        )
                    }
                }}
            />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
    },
    headerContainer: {
        marginTop: 20,
        padding: 15,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: Fonts.condensed,
        marginLeft: 10,
    },
})
