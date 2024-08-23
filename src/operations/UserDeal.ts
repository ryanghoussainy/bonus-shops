import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function getUserDeal(
    user_deal_id: string,
    setRedeemedDays: (redeemedDays: [string]) => void,
    setUserID: (userID: string) => void,
) {
    try {
        // Get user deal
        const { data: userDeal, error } = await supabase
            .from('user_deals')
            .select('redeemed_days, user_id')
            .eq('id', user_deal_id)
            .single();

        if (error) {
            Alert.alert(error.message);
            return;
        }

        if (userDeal) {
            setRedeemedDays(userDeal.redeemed_days);
            setUserID(userDeal.user_id);
        } else {
            Alert.alert("User Deal Not Found");
        }

    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

export async function addPoint(userDealID: string) {
    try {
        // Get user deal
        const { data: userDeal, error } = await supabase
            .from('user_deals')
            .select('points, redeemed_days')
            .eq('id', userDealID)
            .single();

        if (error) {
            Alert.alert(error.message);
            return;
        }

        if (userDeal) {
            const today = new Date().toISOString().split("T")[0];
            const redeemedDays = userDeal.redeemed_days;

            // Add today to redeemed days
            redeemedDays.push(today);

            // Update user deal
            const { error } = await supabase
                .from('user_deals')
                .update({ points: userDeal.points + 1, redeemed_days: redeemedDays })
                .eq('id', userDealID);

            if (error) {
                Alert.alert(error.message);
                return;
            }
        } else {
            Alert.alert("Could not add point", "User Deal Not Found");
        }

    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}
