import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

/*
Represents the deals that a shop user has created.
*/
export type ShopDeal_t = {
    id: string;
    name: string;
    logoUrl: string;
    location: string;
    description: string;
    discountType: number;
    discount: number;
    endDate: string | null;
    maxPoints: number | null;
    disabled: boolean;
    discountTimes: {
        mon_start: string;
        mon_end: string;
        tue_start: string;
        tue_end: string;
        wed_start: string;
        wed_end: string;
        thu_start: string;
        thu_end: string;
        fri_start: string;
        fri_end: string;
        sat_start: string;
        sat_end: string;
        sun_start: string;
        sun_end: string;
    };
}

export async function getShopDeals(session: Session, setDeals?: (deals: ShopDeal_t[]) => void) {
    try {
        // Get user id
        const shopUserID = session.user?.id;
        if (!shopUserID) throw new Error('No user on the session!');

        // Get deals for this user
        const deals: ShopDeal_t[] = [];
        const { data: shopDeals, error } = await supabase
            .from('deals')
            .select('description, type, percentage, end_date, max_pts, id, deal_times_id, disabled')
            .eq('shop_user_id', shopUserID);

        if (error) {
            Alert.alert(error.message);
            return;
        }

        // Get shop name and location
        const { data: shopData, error: shopError } = await supabase
            .from('shop_profiles')
            .select('name, location, logo_url')
            .eq('id', shopUserID)
            .single();

        if (shopError) {
            Alert.alert(shopError.message);
            return;
        }

        for (const deal of shopDeals) {
            if (deal) {
                // Get times for this deal
                const { data: times, error: timesError } = await supabase
                    .from('deal_times')
                    .select(
                        "mon_start, mon_end, \
                        tue_start, tue_end, \
                        wed_start, wed_end, \
                        thu_start, thu_end, \
                        fri_start, fri_end, \
                        sat_start, sat_end, \
                        sun_start, sun_end"
                    )
                    .eq('id', deal.deal_times_id);
                
                if (timesError) {
                    Alert.alert(timesError.message);
                    return;
                }

                deals.push({
                    id: deal.id,
                    name: shopData.name,
                    logoUrl: shopData.logo_url,
                    location: shopData.location,
                    description: deal.description,
                    discountType: deal.type,
                    discount: deal.percentage,
                    endDate: deal.end_date,
                    maxPoints: deal.max_pts,
                    disabled: deal.disabled,
                    discountTimes: times[0],
                });
            }
        }

        if (deals) {
            if (setDeals) setDeals(deals);
            return deals;
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}
