import { Text, Pressable, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colours from "../config/Colours"
import { ShopDeal_t } from "../operations/ShopDeal";
import { getDiscountDescription, getDiscountTimes } from "./DiscountDescription";
import { RootStackParamList } from "../navigation/StackNavigator";
import Fonts from "../config/Fonts";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Image } from "@rneui/themed";
import { getLogo, getLogoPath } from "../operations/Logo";
import { useTheme } from "../contexts/ThemeContext";

type DealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Deal">;

const Deal = ({ session, deal }: { session: Session, deal: ShopDeal_t }) => {
    // Get theme
    const { theme } = useTheme();

    const [url, setUrl] = useState<string>("");
    const [logoUrl, setLogoUrl] = useState<string>("");

    const navigation = useNavigation<DealScreenNavigationProp>(); // Navigation prop

    useEffect(() => {
        if (url) getLogo(url, setLogoUrl);
    }, [url])

    useEffect(() => {
        getLogoPath(session, setUrl);
    }, [session])

    return (
        <Pressable
          onPress={() => navigation.navigate("Deal", { deal: deal })}
          style={[styles.container, { backgroundColor: Colours.dealItem[theme], shadowColor: Colours.text[theme] }]}
        >
        <View style={styles.content}>
            <View style={styles.dealHeader}>
                {/* Shop Name*/}
                <Text style={[styles.name, { color: Colours.text[theme] }]} numberOfLines={2} ellipsizeMode="tail">
                    {deal.name}
                </Text>
                
                {/* get logo from supabase storage */}
                {logoUrl && 
                    <Image
                        source={{ uri: logoUrl }}
                        accessibilityLabel="Logo"
                        style={styles.logo}
                        resizeMode="cover"
                    />
                }
            </View>

            <View style={styles.discount}>
                {getDiscountDescription(deal)}
                {getDiscountTimes(deal)}
            </View>
        </View>
        </Pressable>
    )
}

export default Deal;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "auto",
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 20,

    // Shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 1.5,
  },
  dealHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  discount: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  name: {
    alignSelf: "center",
    fontSize: 29,
    fontWeight: "bold",
    marginVertical: 5,
    marginHorizontal: 15,
    textAlign: "center",
    fontFamily: Fonts.condensed,
    width: "50%",
  },
})
