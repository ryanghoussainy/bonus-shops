import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function getUserDeal(
    user_deal_id: string,
    setRedeemedDays: (redeemedDays: [string]) => void,
    setUserID: (userID: string) => void,
) {
    try {
        // Get user_deal
        const { data: user_deal, error } = await supabase
            .from('user_deals')
            .select('redeemed_days, user_id')
            .eq('id', user_deal_id)
            .single();

        if (error) {
            Alert.alert(error.message);
            return;
        }

        if (user_deal) {
            await setRedeemedDays(user_deal.redeemed_days);
            await setUserID(user_deal.user_id);
        } else {
            Alert.alert("User Deal Not Found");
        }

    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

export async function addPoint(user_deal_id: string) {
    try {
        // Get user_deal
        const { data: user_deal, error } = await supabase
            .from('user_deals')
            .select('points, redeemed_days')
            .eq('id', user_deal_id)
            .single();

        if (error) {
            Alert.alert(error.message);
            return;
        }

        if (user_deal) {
            const today = new Date().toISOString().split("T")[0];
            const redeemed_days = user_deal.redeemed_days;

            // Add today to redeemed_days
            redeemed_days.push(today);

            // Update user_deal
            const { error } = await supabase
                .from('user_deals')
                .update({ points: user_deal.points + 1, redeemed_days })
                .eq('id', user_deal_id);

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
