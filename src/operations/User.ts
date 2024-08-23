import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'

/*
Get the user's name, location and description.
*/
export async function getUser(
    session: Session,
    setShopName: (name: string) => void,
    setLocation: (location: string) => void,
    setDescription: (description: string) => void,
    setMobileNumber: (mobileNumber: string) => void,
    setLoading: (loading: boolean) => void
) {
    try {
        if (!session?.user) throw new Error('No user on the session!')

        setLoading(true)
        const { data, error } = await supabase
            .from('shop_profiles')
            .select('name, location, description, mobile_number')
            .eq('id', session.user.id)
            .single()

        if (error) {
            Alert.alert(error.message)
            return;
        }

        if (data) {
            setShopName(data.name)
            setLocation(data.location)
            setDescription(data.description)
            setMobileNumber(data.mobile_number)
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    } finally {
        setLoading(false)
    }
}

export async function createUser(
    email: string,
    password: string,
    mobileNumber: string,
    shopName: string,
    location: string,
    description: string,
    logoUrl: string,
    preferredTheme: string,
    setLoading: (loading: boolean) => void
) {
    // Sign up with email and password
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { role: '1' }
      }
    })

    if (error) {
        Alert.alert(error.message)
        setLoading(false)
        return
    }
    if (!session) {
        Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
        return
    }

    // A profile is automatically created for the user via a trigger in the backend
    // Wait for the profile to be created, and update the user's details
    let profileCreated = false
    while (!profileCreated) {
        const { data: profile, error: profileError } = await supabase
            .from('shop_profiles')
            .select('id')
            .eq('id', session.user.id)
            .single()

        if (profileError) {
            Alert.alert(profileError.message)
            setLoading(false)
            return
        }

        if (profile) {
            profileCreated = true
        }
    }

    // Update the user's details
    const { error: updateError } = await supabase.from('shop_profiles').upsert({
        id: session.user.id,
        updated_at: new Date(),
        name: shopName,
        location: location,
        description: description,
        mobile_number: mobileNumber,
        logo_url: logoUrl,
        theme: preferredTheme,
    })

    if (updateError) {
        Alert.alert(updateError.message)
        setLoading(false)
        return
    }

    setLoading(false)
}

/*
Update the user's name.
*/
export async function updateUser(
    session: Session,
    shopName: string,
    location: string,
    description: string,
    mobileNumber: string,
    setLoading: (loading: boolean) => void
) {
    try {
        if (!session?.user) throw new Error('No user on the session!')

        setLoading(true)
        const { error } = await supabase
            .from('shop_profiles')
            .update({ name: shopName, location, description, mobile_number: mobileNumber })
            .eq('id', session.user.id)

        if (error) {
            Alert.alert(error.message)
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    } finally {
        setLoading(false)
    }
}

export async function checkValidUser(
    userID: string,
) {
    // Get user
    const { error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userID)
        .single();

    if (error) {
        Alert.alert("Invalid user ID", error.message);
        return false;
    }

    return true;
}
