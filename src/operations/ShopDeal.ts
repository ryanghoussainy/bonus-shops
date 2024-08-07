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
    user_deal_id: string;
}

export async function getShopDeals(session: Session, setDeals: (deals: ShopDeal_t[]) => void) {
    try {
        // Get user_id
        const user_id = session.user?.id;
        if (!user_id) throw new Error('No user on the session!');
        
        // Get user_deals for this user
        const { data: user_deals, error } = await supabase
            .from('user_deals')
            .select('id, user_id, deal_id, points')
            .eq('user_id', user_id);

        if (error) {
            Alert.alert(error.message);
            return;
        };

        // Get deals from these user_deals
        const deals: ShopDeal_t[] = [];
        for (const user_deal of user_deals) {
            const { data: deal, error } = await supabase
                .from('deals')
                .select('name, description, location, type, percentage, start_time, end_time, end_date, days, max_pts')
                .eq('id', user_deal.deal_id)
                .single();

            if (error) {
                Alert.alert(error.message);
                return;
            }

            if (deal) {
                deals.push({ ...deal, user_deal_id: user_deal.id });
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
