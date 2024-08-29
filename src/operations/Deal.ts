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
    // Get user id
    const shopUserID = session.user?.id;
    if (!shopUserID) throw new Error('No user on the session!');
    
    setLoading(true);
    // Create deal times
    const { data: dealTimes, error: dealTimesError } = await supabase
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

    if (dealTimesError) {
        Alert.alert(dealTimesError.message);
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
                shop_user_id: shopUserID,
                deal_times_id: dealTimes[0].id,
            }
        ])
        .select('id');

    if (error) {
        Alert.alert(error.message);
        setLoading(false);
        return;
    }

    // Create user deals
    // Get new deal id
    if (!data) throw new Error('No deal created!');
    const dealID = data[0].id;

    // Fetch all users
    const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id');
    
    if (usersError) {
        Alert.alert(usersError.message);
        setLoading(false);
        return
    }

    // For each user, create a user deal with the new deal
    for (const user of users) {
        const { error } = await supabase
            .from('user_deals')
            .insert([
                {
                    user_id: user.id,
                    updated_at: new Date(),
                    deal_id: dealID,
                    points: discountType === 0 ? 0 : null,
                    redeemed_days: discountType === 0 ? [] : null,
                }
            ]);

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
        }
    }

    setLoading(false);
}
