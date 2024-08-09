import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export type ShopDeal_t = {
    name: string;
    description: string;
    location: string;
    type: number;
    percentage: number;
    start_time: string;
    end_time: string;
    end_date: string;
    days: string;
    max_pts?: number;
}

export async function getShopDeals(session: Session, setDeals: (deals: ShopDeal_t[]) => void) {
    try {
        // Get user_id
        const shop_user_id = session.user?.id;
        if (!shop_user_id) throw new Error('No user on the session!');

        // Get deals for this user
        const deals: ShopDeal_t[] = [];
        const { data: shop_deals, error } = await supabase
            .from('deals')
            .select('description, type, percentage, start_time, end_time, end_date, days, max_pts, id')
            .eq('shop_user_id', shop_user_id);

        if (error) {
            Alert.alert(error.message);
            return;
        }

        // Get shop name and location
        const { data: shop_data, error: shop_error } = await supabase
            .from('shop_profiles')
            .select('name, location')
            .eq('id', shop_user_id)
            .single();

        if (shop_error) {
            Alert.alert(shop_error.message);
            return;
        }

        for (const deal of shop_deals) {
            if (deal) {
                deals.push({
                    ...deal,
                    name: shop_data.name,
                    location: shop_data.location,
                });
            }
        }

        if (deals) {
            setDeals(deals);
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}
