import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import Colours from "../config/Colours";
import { Session } from "@supabase/supabase-js";
import Account from "../screens/Settings";
import CreateDealScreen from "../screens/CreateDealScreen";
import { useTheme } from "../contexts/ThemeContext";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ session }: { session: Session }) {
  // Get theme
  const { theme } = useTheme();

  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: [styles.tabBar, { backgroundColor: Colours.dealItem[theme] }] }}>
      <Tab.Screen
        name="Home"
        options={() => ({
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colours.primary[theme],
        })}>
        {() => <HomeScreen session={session} />}
      </Tab.Screen>

      <Tab.Screen
        name="Create Deal"
        options={() => ({
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={30} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colours.primary[theme],
        })}
      >
        {() => <CreateDealScreen session={session}/>}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={() => ({
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={30} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colours.primary[theme],
        })}
      >
        {() => <Account session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
  },
});
