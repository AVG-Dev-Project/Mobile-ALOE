import { Colors } from '_theme/Colors';
import { StyleSheet } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from '_utils';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      marginTop: 8,
      marginBottom: heightPercentageToDP(12),
      paddingHorizontal: 5,
      backgroundColor: Colors.background,
   },
   landing_screen: {
      height: heightPercentageToDP(28),
      borderRadius: 25,
      backgroundColor: Colors.greenAvg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
   },
   text_landing_screen: {
      fontSize: widthPercentageToDP(5),
      color: Colors.white,
      fontWeight: 'bold',
   },
   content_in_landing_screen: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: Colors.greenWhite,
      width: widthPercentageToDP(90),
      paddingHorizontal: 0,
      paddingVertical: 20,
      borderRadius: 25,
   },
   icon_in_content_landing: {
      width: 42,
      height: 42,
      borderRadius: 62,
   },
   /*article*/
   image_poster_style_article: {
      height: 130,
      width: 230,
      borderRadius: 15,
   },
   /*Thematique*/
   /*Types*/
   maskImageCatg: {
      borderRadius: 18,
      height: 130,
      width: 230,
      borderWidth: 2,
      borderColor: Colors.greenAvg,
   },

   view_container_renderItemThematique: {
      width: 230,
      height: 130,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
   },

   view_carousel: {
      width: '100%',
      flexDirection: 'row',
   },

   text_descriptif_for_carousel: {
      fontWeight: 'bold',
      opacity: 0.9,
      color: Colors.black,
      fontSize: widthPercentageToDP(4.5),
      flexWrap: 'wrap',
      textAlign: 'center',
   },
   view_bottom_sheet: {
      marginHorizontal: 6,
   },
   view_in_bottomsheet: {
      paddingVertical: 10,
      display: 'flex',
      flex: 1,
   },
   view_one_item_in_bottomsheet: {
      height: 70,
      paddingHorizontal: 12,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: Colors.greenAvg,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
   },
   text_bottomsheet: {
      fontSize: 26,
      marginLeft: 13,
      fontWeight: 'bold',
   },
});
