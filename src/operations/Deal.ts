import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function createDeal(
    session: Session,
    description: string,
    endDate: string | null,
    discountTimes: { [key: string]: string | null },
    discount: number,
    discountType: number,
    maxPoints: number,
    setLoading: (loading: boolean) => void,
) {
    // Get user_id
    const shop_user_id = session.user?.id;
    if (!shop_user_id) throw new Error('No user on the session!');
    
    setLoading(true);
    // Create deal times
    const { data: deal_times, error: deal_times_error } = await supabase
        .from('deal_times')
        .insert([
            {
                mon_start: discountTimes.mon_start,
                mon_end: discountTimes.mon_end,
                tue_start: discountTimes.tue_start,
                tue_end: discountTimes.tue_end,
                wed_start: discountTimes.wed_start,
                wed_end: discountTimes.wed_end,
                thu_start: discountTimes.thu_start,
                thu_end: discountTimes.thu_end,
                fri_start: discountTimes.fri_start,
                fri_end: discountTimes.fri_end,
                sat_start: discountTimes.sat_start,
                sat_end: discountTimes.sat_end,
                sun_start: discountTimes.sun_start,
                sun_end: discountTimes.sun_end,
            }
        ])
        .select('id');

    if (deal_times_error) {
        Alert.alert(deal_times_error.message);
        setLoading(false);
        return;
    }

    // Insert deal
    const { data, error } = await supabase
        .from('deals')
        .insert([
            {
                updated_at: new Date(),
                description,
                type: discountType,
                percentage: discount,
                end_date: endDate,
                max_pts: maxPoints,
                shop_user_id,
                deal_times_id: deal_times[0].id,
            }
        ])
        .select('id');

    if (error) {
        Alert.alert(error.message);
        setLoading(false);
        return;
    }

    // Create user_deals
    // Get new deal id
    if (!data) throw new Error('No deal created!');
    const deal_id = data[0].id;

    // Fetch all users
    const { data: users, error: users_error } = await supabase
        .from('profiles')
        .select('id');
    
    if (users_error) {
        Alert.alert(users_error.message);
        setLoading(false);
        return
    }

    // For each user, create a user_deal with the new deal
    for (const user of users) {
        const { error } = await supabase
            .from('user_deals')
            .insert([
                {
                    user_id: user.id,
                    deal_id: deal_id,
                    points: 0,
                    updated_at: new Date(),
                    redeemed_days: [],
                }
            ]);

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
        }
    }

    setLoading(false);
}
