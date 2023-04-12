import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

let widthDevice = Dimensions.get('window').width;
let heightDevice = Dimensions.get('window').height;
export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
   },
   image_bg_detail: {
      flex: 1,
      justifyContent: 'center',
   },
   info_in_landing_detail: {
      marginTop: heightDevice < 700 ? 50 : 60,
      marginLeft: 28,
   },
   maskImageDetailArticle: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
   },
   description_section: {
      paddingHorizontal: 24,
      height: heightDevice < 700 ? heightDevice - 230 : heightDevice - 260,
      backgroundColor: Colors.white,
   },
   view_round_button_detail_article: {
      position: 'absolute',
      top: -28,
      right: 32,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   boutton_add_favorite: {
      backgroundColor: Colors.greenWhite,
      marginRight: 8,
      width: 50,
      height: 50,
      padding: 10,
      borderRadius: 50,
   },
   label_info_article: {
      fontWeight: 'bold',
      color: Colors.greenAvg,
      fontSize: 22,
   },
   value_info_article: {
      fontSize: 20,
   },
   boutton_info_article: {
      backgroundColor: Colors.greenWhite,
      width: 52,
      height: 52,
      padding: 10,
      borderRadius: 52,
   },
   all_button_in_detail_screen: {
      marginTop: heightDevice < 700 ? 10 : 12,
      marginBottom: heightDevice < 700 ? 0 : 26,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
   },
   button_in_detail: {
      textAlign: 'center',
      backgroundColor: Colors.greenWhite,
      paddingVertical: 10,
      width: 90,
      paddingHorizontal: 24,
      color: Colors.greenAvg,
      borderRadius: 20,
      fontSize: 21,
      fontWeight: '800',
   },
   view_bottom_sheet: {
      backgroundColor: '#f2f2f2',
   },
   view_in_bottomsheet: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      backgroundColor: '#f2f2f2',
      marginHorizontal: 8,
      paddingHorizontal: 18,
   },
   view_one_item_in_bottomsheet: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 8,
   },
});
