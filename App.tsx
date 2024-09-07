import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabase'
import Auth from './src/screens/Auth'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { StatusBar } from 'expo-status-bar'
import Colours from './src/config/Colours'
import Navigator from './src/navigation/StackNavigator'
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext'
import { PaperProvider } from 'react-native-paper'

export default function App() {
  // Get theme
  const { theme } = useTheme();

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <PaperProvider>
      <ThemeProvider session={session}>
        <View style={{ flex: 1 }}>
          <StatusBar style={theme === "dark" ? "light" : "dark"} backgroundColor={Colours.background[theme]} />
          {session && session.user ? <Navigator session={session} /> : <Auth />}
        </View>
      </ThemeProvider>
    </PaperProvider>
  )
}
