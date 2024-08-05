import { View, Text, StyleSheet } from 'react-native';
import colours from '../config/Colours';

export default function NotImplemented() {
 return (
   <View style={styles.container}>
     <Text style={styles.text}>Not Implemented!</Text>
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
