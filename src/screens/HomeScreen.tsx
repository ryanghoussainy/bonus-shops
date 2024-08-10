import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Button } from '@rneui/themed';
import Colours from '../config/Colours';
import { getShopDeals, ShopDeal_t } from '../operations/ShopDeal';
import Deal from '../components/Deal';
import { getUser } from '../operations/User';
import promptDetails from '../components/PromptDetails';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen({ session }: { session: Session }) {
    const [shopName, setShopName] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [displayPrompt, setDisplayPrompt] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    const [deals, setDeals] = useState<ShopDeal_t[]>([])

    const navigation = useNavigation();

    const fetchDeals = async () => {
        setLoading(true);
        await getShopDeals(session, setDeals);
        setLoading(false);
    };

    useEffect(() => {
        fetchDeals();
    }, [session])

    useEffect(() => {
        if (session) {
            getUser(session, setShopName, setLocation, setDisplayPrompt)
        }
    }, [session])

    useEffect(() => {
        if (displayPrompt) {
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
    }, [displayPrompt])

    return (
    <View style={{ flex: 1 }}>
        <FlatList
            data={deals}
            renderItem={({ item }) => <Deal deal={item}/>}
            style={{ backgroundColor: Colours.background[Colours.theme] }}
            ListEmptyComponent={() => {
                if (loading) {
                    return (
                    <View style={styles.container}>
                      <ActivityIndicator size="large" color={Colours.green[Colours.theme]} />
                    </View>
                  ) 
                } else {
                  return (
                    <View style={styles.container}>
                      <Text style={styles.text}>No deals found.</Text>
                      <Button
                        title="Refresh"
                        onPress={fetchDeals}
                        color={Colours.green[Colours.theme]}
                      />
                    </View>
                  )
                }
            }}
        />

        {displayPrompt && promptDetails(
            session,
            setDisplayPrompt,
            shopName,
            setShopName,
            location,
            setLocation,
            description,
            setDescription
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
})
