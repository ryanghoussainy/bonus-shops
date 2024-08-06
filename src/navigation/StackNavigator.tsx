import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { Session } from "@supabase/supabase-js";
import Colours from "../config/Colours";
import MainTabNavigator from "./MainTabNavigator";
import { ShopDeal_t } from "../operations/ShopDeal";
import DealScreen from "../screens/DealScreen";

export type RootStackParamList = {
  "Your Deals": { session: Session };
  "Deal": { deal: ShopDeal_t };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = ({ session }: { session: Session }) => {
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
        <Stack.Screen name="Deal" component={DealScreen} />
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
});

export default Navigator;
