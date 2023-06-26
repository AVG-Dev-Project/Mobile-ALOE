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
      height: heightPercentageToDP(90),
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
      justifyContent: 'space-between',
      width: '65%',
      height: 80,
   },
   view_button_switch_article: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
   },
   description_section: {
      paddingHorizontal: 14,
      height: heightPercentageToDP(80),
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
      flexDirection: 'row',
      justifyContent: 'center',
   },
   titleOfOverview: {
      flexDirection: 'column',
   },
   typeOfContenu: {
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
      color: Colors.white,
   },
   label_titre: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.greenAvg,
   },
   label_chapitre: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   label_section: {
      fontSize: 16,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
   },
});
