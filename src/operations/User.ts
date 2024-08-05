import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'


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
