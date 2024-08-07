import { View, Text, StyleSheet } from 'react-native';
import colours from '../config/Colours';
import { Session } from '@supabase/supabase-js';

export default function Account({ session }: { session: Session }) {
 return (
   <View style={styles.container}>
     <Text style={styles.text}>Your account</Text>
   </View>
 )
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: colours.background[colours.theme],
   },
   text: {
       fontSize: 18,
       fontWeight: "500",
       color: colours.text[colours.theme],
   },
})
