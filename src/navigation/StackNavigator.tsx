import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import Colours from "../config/Colours";
import MainTabNavigator from "./MainTabNavigator";
import { ShopDeal_t } from "../operations/ShopDeal";
import DealScreen from "../screens/DealScreen";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type RootStackParamList = {
  "Your Deals": { session: Session };
  "Deal": { deal: ShopDeal_t };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = ({ session }: { session: Session }) => {
  // Check that the user is signed it to the right app
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
        const { data: user, error } = await supabase.auth.getUser();

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return;
        }

        if (user) {
            const role = user.user.user_metadata.role;

            if (role !== '1') {
              // Sign out and alert the user
              await supabase.auth.signOut();
              Alert.alert('The login details you entered are not for this app.', 'Please sign in with the correct details.')
            } else {
              // User is authorised
              setLoading(false);
            }
        }
    }
    checkUserRole();
  }, [])

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colours.green[Colours.theme]} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.navigation,
          headerTitleStyle: styles.title,
          headerTintColor: Colours.text[Colours.theme],
        }}
      >
        <Stack.Screen name="Your Deals">
          {() => <MainTabNavigator key={session.user.id} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="Deal">
          {() => <DealScreen session={session} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  navigation: {
    backgroundColor: Colours.background[Colours.theme],
  },
  title: {
    color: Colours.text[Colours.theme],
    fontWeight: "bold",
    fontSize: 25,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colours.background[Colours.theme],
  },
});

export default Navigator;
