import { Alert } from "react-native";
import { supabase } from "../lib/supabase";


export async function getShopNames() {
    const { data: shops, error } = await supabase
        .from("shop_profiles")
        .select("name");

    if (error) {
        Alert.alert(error.message);
        return [];
    }

    return shops;
}
