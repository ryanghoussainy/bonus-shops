import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function createDeal(
    session: Session,
    description: string,
    type: number,
    percentage: number,
    start_time: string,
    end_time: string,
    end_date: string,
    days: string,
    setLoading: (loading: boolean) => void,
    max_pts?: number,
) {
    // Get user_id
    const shop_user_id = session.user?.id;
    if (!shop_user_id) throw new Error('No user on the session!');

    // Insert deal
    setLoading(true);
    const { data, error } = await supabase
        .from('deals')
        .insert([
            {
                description: description,
                type: type,
                percentage: percentage,
                start_time: start_time,
                end_time: end_time,
                end_date: end_date,
                days: days,
                max_pts: max_pts,
                updated_at: new Date(),
                shop_user_id,
            }
        ])
        .select('id');

    if (error) throw error;

    // Create user_deals
    // Get new deal id
    if (!data) throw new Error('No deal created!');
    const deal_id = data[0].id;

    // Fetch all users
    const { data: users, error: users_error } = await supabase
        .from('profiles')
        .select('id');
    
    if (users_error) throw users_error;

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

        if (error) throw error;
    }

    setLoading(false);
}
