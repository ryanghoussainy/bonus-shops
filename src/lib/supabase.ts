import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wpylabgqbrubnojembyv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweWxhYmdxYnJ1Ym5vamVtYnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzMDYwMjQsImV4cCI6MjAzNTg4MjAyNH0.wyyS3eGV7CptNES7qWfl1DVi-yH_WXljv1MOqDp4PO0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
