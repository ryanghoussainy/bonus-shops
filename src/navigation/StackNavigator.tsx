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
import { useTheme } from "../contexts/ThemeContext";
import Account from "../screens/settingsScreens/Account";
import General from "../screens/settingsScreens/General";

export type RootStackParamList = {
  "Main": { session: Session };
  "Deal": { deal: ShopDeal_t };
  "Screen1": { previousDeal: ShopDeal_t | null };
  "Screen2": { previousDeal: ShopDeal_t | null, discountType: number, maxPoints: number | null };
  "Screen3": { previousDeal: ShopDeal_t | null, discount: number, discountType: number, maxPoints: number | null };
  "Screen4": { previousDeal: ShopDeal_t | null, discountTimes: { [key: string]: string | null }, discount: number, discountType: number, maxPoints: number | null };
  "Screen5": { previousDeal: ShopDeal_t | null, endDate: string | null, discountTimes: { [key: string]: string | null }, discount: number, discountType: number, maxPoints: number | null };
  "Screen6": { description: string; endDate: string | null, discountTimes: { [key: string]: string | null }, discount: number, discountType: number, maxPoints: number | null };
  "Account": undefined;
  "General": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = ({ session }: { session: Session }) => {
  // Get theme
  const { theme } = useTheme();

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
      <View style={[styles.loading, { backgroundColor: Colours.background[theme] }]}>
        <ActivityIndicator size="large" color={Colours.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colours.background[theme] },
          headerTitleStyle: [styles.title, { color: Colours.text[theme] }],
          headerTintColor: Colours.text[theme],
        }}
      >
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {() => <MainTabNavigator key={session.user.id} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="Deal" options={{ animation: 'fade_from_bottom' }}>
          {() => <DealScreen session={session} />}
        </Stack.Screen>

        {/* Screens for creating deal */}
        <Stack.Screen name="Screen1" options={{ headerShown: false, animation: 'fade_from_bottom' }}>
          {() => <Screen1 />}
        </Stack.Screen>
        <Stack.Screen name="Screen2" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <Screen2 />}
        </Stack.Screen>
        <Stack.Screen name="Screen3" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <Screen3 />}
        </Stack.Screen>
        <Stack.Screen name="Screen4" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <Screen4 />}
        </Stack.Screen>
        <Stack.Screen name="Screen5" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <Screen5 />}
        </Stack.Screen>
        <Stack.Screen name="Screen6" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <Screen6 session={session} />}
        </Stack.Screen>

        {/* Settings Screens */}
        <Stack.Screen name="Account" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <Account session={session} />}
        </Stack.Screen>
        <Stack.Screen name="General" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <General session={session} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 25,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Navigator;
