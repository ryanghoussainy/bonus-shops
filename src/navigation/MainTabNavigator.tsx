import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import Colours from "../config/Colours";
import { Session } from "@supabase/supabase-js";
import Account from "../screens/Account";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ session }: { session: Session }) {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar }}>
      <Tab.Screen
        name="Home"
        options={() => ({
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colours.green[Colours.theme],
        })}>
        {() => <HomeScreen session={session} />}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={() => ({
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={30} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colours.green[Colours.theme],
        })}
      >
        {() => <Account session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colours.dealItem[Colours.theme],
    borderTopWidth: 0,
  },
});
