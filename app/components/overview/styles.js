import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from '_utils';

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
   content_article_view: {
      height: heightPercentageToDP(88),
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
   view_header_nav_detail_entete: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      height: 80,
   },
   view_button_switch_article: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
   },
   description_section: {
      paddingHorizontal: 24,
      height: heightDevice - 280,
      backgroundColor: Colors.white,
   },
   view_round_button_detail_article: {
      position: 'absolute',
      top: heightPercentageToDP(-4.5),
      right: 14,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   view_round_button_detail_article_detail_entete: {
      position: 'absolute',
      top: heightPercentageToDP(-3.5),
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
   view_bottom_sheet: {
      backgroundColor: '#f2f2f2',
   },
   view_in_bottomsheet: {
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
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginRight: widthPercentageToDP(6.5),
   },
});
