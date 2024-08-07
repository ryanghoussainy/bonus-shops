import { Text, Pressable, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colours from "../config/Colours"
import { ShopDeal_t } from "../operations/ShopDeal";
import getDiscountDescription from "./DiscountDescription";
import { RootStackParamList } from "../navigation/StackNavigator";
import Fonts from "../config/Fonts";

type DealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Deal">;

const Deal = ({ deal }: { deal: ShopDeal_t }) => {
  const navigation = useNavigation<DealScreenNavigationProp>(); // Navigation prop

  return (
    <Pressable onPress={() => navigation.navigate("Deal", { deal: deal })} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{deal.name}</Text>

        <View style={styles.discount}>{getDiscountDescription(deal)}</View>
      </View>
    </Pressable>
  )
}

export default Deal;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "auto",
    marginHorizontal: 30,
    marginVertical: 10,
    backgroundColor: Colours.dealItem[Colours.theme],
    borderRadius: 20,

    // Shadow
    shadowColor: Colours.text[Colours.theme],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 1.5,
  },
  content: {
    flex: 1,
  },
  discount: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: "center",
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "black",
  },
  name: {
    alignSelf: "center",
    fontSize: 29,
    fontWeight: "bold",
    marginVertical: 5,
    marginHorizontal: 15,
    textAlign: "center",
    color: Colours.text[Colours.theme],
    fontFamily: Fonts.condensed,
  },
})
