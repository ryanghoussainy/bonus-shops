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
    setDisplayPrompt?: (displayPrompt: boolean) => void
) {
    try {
      if (!session?.user) throw new Error('No user on the session!')
  
      const { data, error, status } = await supabase
        .from('shop_profiles')
        .select(`name, location`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }
  
      if (data) {
        setShopName(data.name)
        setLocation(data.location)
        if (setDisplayPrompt) {
            if (!data.name || !data.location) {
                setDisplayPrompt(true)
            } else {
                setDisplayPrompt(false)
            }
        }
      } else {
        if (setDisplayPrompt) setDisplayPrompt(true)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
}

export async function createUser(
    email: string,
    password: string,
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
    setLoading(false)
}

/*
Update the user's name.
*/
export async function updateUser(
    session: Session,
    shopName: string,
    location: string,
    description: string
) {
    try {
      if (!session?.user) throw new Error('No user on the session!')
  
      const updates = {
        id: session?.user.id,
        name: shopName,
        location,
        description,
        updated_at: new Date(),
      }
  
      const { error } = await supabase.from('shop_profiles').upsert(updates)
  
      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
}
