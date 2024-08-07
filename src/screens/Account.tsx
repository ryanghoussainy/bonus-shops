import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Text } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { getUser } from '../operations/User'
import Colours from "../config/Colours"
import Fonts from '../config/Fonts'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (session) getUser(session, setName, setLocation, setLoading, undefined)
  }, [session])

  return (
    <View style={styles.container}>
      <Text style={styles.h2}>
        Account
      </Text>

      <View style={styles.miniDivider} />

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input 
          label="Email" 
          value={session?.user?.email} 
          style={styles.input}
          disabled
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input 
          label="Name"
          value={name}
          style={styles.input}
          disabled
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input 
          label="Location"
          value={location}
          style={styles.input}
          disabled
        />
      </View>

      <Text style={styles.text}>If you wish to change any details, please get in contact via email.</Text>

      <View style={styles.signOutSection}>
        <Text style={styles.h2}>
          Sign Out
        </Text>

        <View style={styles.miniDivider} />

        <View style={styles.verticallySpaced}>
          <Button 
            title="Sign Out" 
            onPress={() => supabase.auth.signOut()} 
            color={Colours.red[Colours.theme]}
            disabled={loading}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colours.background[Colours.theme],
    flex: 1,
  },
  signOutSection: {
    borderTopWidth: 1,
    borderTopColor: Colours.grey[Colours.theme],
    marginTop: 15,
    paddingTop: 15,
  },
  text: {
    color: Colours.text[Colours.theme],
    fontFamily: Fonts.condensed,
    fontSize: 18,
    textAlign: "center"
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  input: {
    color: Colours.text[Colours.theme],
    fontFamily: Fonts.condensed,
  },
  mt20: {
    marginTop: 20,
  },
  h2: {
    fontSize: 23,
    fontWeight: 'bold',
    color: Colours.text[Colours.theme],
    alignSelf: "center",
    fontFamily: Fonts.condensed,
  },
  miniDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colours.green[Colours.theme],
    width: "20%",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 2,
  },
})
