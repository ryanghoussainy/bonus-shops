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
import Screen1 from "../screens/createDealScreens/Screen1";
import Screen2 from "../screens/createDealScreens/Screen2";
import Screen3 from "../screens/createDealScreens/Screen3";
import Screen4 from "../screens/createDealScreens/Screen4";
import Screen5 from "../screens/createDealScreens/Screen5";
import Screen6 from "../screens/createDealScreens/Screen6";

export type RootStackParamList = {
  "Your Deals": { session: Session };
  "Deal": { deal: ShopDeal_t };
  "Screen1": { previousDeal: ShopDeal_t | null };
  "Screen2": { previousDeal: ShopDeal_t | null, discountType: number, maxPoints: number | null };
  "Screen3": { previousDeal: ShopDeal_t | null, discount: number, discountType: number, maxPoints: number | null };
  "Screen4": { previousDeal: ShopDeal_t | null, discountTimes: { [key: string]: string | null }, discount: number, discountType: number, maxPoints: number | null };
  "Screen5": { previousDeal: ShopDeal_t | null, endDate: string | null, discountTimes: { [key: string]: string | null }, discount: number, discountType: number, maxPoints: number | null };
  "Screen6": { description: string; endDate: string | null, discountTimes: { [key: string]: string | null }, discount: number, discountType: number, maxPoints: number | null };
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
        <ActivityIndicator size="large" color={Colours.primary[Colours.theme]} />
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
        <Stack.Screen name="Your Deals" options={{ headerShown: false }}>
          {() => <MainTabNavigator key={session.user.id} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="Deal">
          {() => <DealScreen session={session} />}
        </Stack.Screen>

        {/* Screens for creating deal */}
        <Stack.Screen name="Screen1" options={{ headerShown: false }}>
          {() => <Screen1 />}
        </Stack.Screen>
        <Stack.Screen name="Screen2" options={{ headerShown: false }}>
          {() => <Screen2 />}
        </Stack.Screen>
        <Stack.Screen name="Screen3" options={{ headerShown: false }}>
          {() => <Screen3 />}
        </Stack.Screen>
        <Stack.Screen name="Screen4" options={{ headerShown: false }}>
          {() => <Screen4 />}
        </Stack.Screen>
        <Stack.Screen name="Screen5" options={{ headerShown: false }}>
          {() => <Screen5 />}
        </Stack.Screen>
        <Stack.Screen name="Screen6" options={{ headerShown: false }}>
          {() => <Screen6 session={session} />}
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
