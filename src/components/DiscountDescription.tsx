import { StyleSheet, Text, View } from "react-native";
import { ShopDeal_t } from "../operations/ShopDeal";
import Colours from "../config/Colours";
import { getWeekdays } from "../config/Weekdays";
import { formatTime, formatDate } from "../config/FormatDateTime";
import Fonts from "../config/Fonts";


export function getDiscountDescription(deal: ShopDeal_t) {
  switch (deal.discountType) {
    case 0: // Classic bonus point type discount
      return (
        <View style={styles.container}>
          <View style={styles.discountView}>
            <Text style={styles.discountText}>
              <Text style={styles.discountAmount}>{deal.discount}%</Text>
              {" off\nwhen you come "}
              <Text style={styles.discountTime}>{deal.maxPoints} times</Text>
            </Text>
          </View>
        </View>
      )
    case 1: // Limited-time discount
      return (
        <View style={styles.container}>
          <View style={styles.discountView}>
            <Text style={styles.discountText}>
              <Text style={styles.discountAmount}>{deal.discount}%</Text>
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
    color: Colours.gold[Colours.theme],
    fontSize: 40,
  },
  discountText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: Colours.text[Colours.theme],
    fontFamily: Fonts.condensed,
  },
  discountTime: {
    color: Colours.primary[Colours.theme],
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
