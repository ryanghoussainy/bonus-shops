import { StyleSheet, Text, View } from "react-native";
import { ShopDeal_t } from "../operations/ShopDeal";
import Colours from "../config/Colours";
import { getWeekdays } from "../config/Weekdays";
import { formatTime, formatDate } from "../config/FormatDateTime";
import Fonts from "../config/Fonts";
import { useTheme } from "../contexts/ThemeContext";


export function getDiscountDescription(deal: ShopDeal_t) {
  // Get theme
  const { theme } = useTheme();

  switch (deal.discountType) {
    case 0: // Classic bonus point type discount
      return (
        <View style={styles.container}>
          <View style={styles.discountView}>
            <Text style={[styles.discountText, { color: Colours.text[theme] }]}>
              <Text style={[styles.discountAmount, { color: Colours.gold[theme] }]}>{deal.discount}%</Text>
              {" off\nwhen you come "}
              <Text style={[styles.discountTime, { color: Colours.primary[theme] }]}>{deal.maxPoints} times</Text>
            </Text>
          </View>
        </View>
      )
    case 1: // Limited-time discount
      return (
        <View style={styles.container}>
          <View style={styles.discountView}>
            <Text style={[styles.discountText, { color: Colours.text[theme] }]}>
              <Text style={[styles.discountAmount, { color: Colours.gold[theme] }]}>{deal.discount}%</Text>
              {" off"}
            </Text>
          </View>
        </View>
      )
  }
}

export function getDiscountTimes(deal: ShopDeal_t) {
  return null
  // switch (deal.type) {
  //   case 0: // Classic bonus point type discount
  //     return (
  //       <View style={styles.container}>
  //         <View style={styles.discountDetailsView}>
  //             <Text style={[styles.discountText, styles.left]}>
  //               - {getWeekdays(deal.days) + "\n"}
  //               - {formatTime(deal.start_time) + " to " + formatTime(deal.end_time)}
  //               {deal.end_date == null ? "" : `\n- valid until ${formatDate(deal.end_date)}`}
  //             </Text>
  //         </View>
  //       </View>
  //     )
  //   case 1: // Limited-time discount
  //     return (
  //       <View style={styles.container}>
  //         <View style={styles.discountDetailsView}>
  //             <Text style={[styles.discountText, styles.left]}>
  //               - {getWeekdays(deal.days) + "\n"}
  //               - {formatTime(deal.start_time) + " to " + formatTime(deal.end_time)}
  //               {deal.end_date == null ? "" : `\n- valid until ${formatDate(deal.end_date)}`}
  //             </Text>
  //         </View>
  //       </View>
  //     )
  // }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  discountAmount: {
    fontSize: 40,
  },
  discountText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: Fonts.condensed,
  },
  discountTime: {
    fontSize: 30,
  },
  discountView: {
    marginBottom: 10,
    padding: 15,
  },
  discountDetailsView: {
    marginBottom: 10,
    paddingTop: 15,
    marginLeft: 10,
  },
  left: {
    textAlign: "left",
    fontSize: 15,
  }
});
