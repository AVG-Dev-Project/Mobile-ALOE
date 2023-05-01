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
      marginTop: 5,
      marginLeft: 28,
   },
   maskImageDetailArticle: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
   },
   view_header_nav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
   },
   view_button_switch_article: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
   },
   description_section: {
      paddingHorizontal: 24,
      height: heightDevice < 700 ? heightDevice - 230 : heightDevice - 230,
      backgroundColor: Colors.white,
   },
   view_round_button_detail_article: {
      position: 'absolute',
      top: -22,
      right: 14,
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
   fab_button: {
      flexDirection: 'row',
      paddingVertical: 5,
      flexGrow: 1,
   },
   view_content_fab_button: {
      width: '90%',
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
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
   view_button_zoom: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
});
