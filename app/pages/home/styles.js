import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

let widthDevice = Dimensions.get('window').width;
export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      marginTop: 8,
      marginBottom: 80,
      paddingHorizontal: 5,
      backgroundColor: Colors.background,
   },
   head_content: {
      height: 45,
      marginVertical: 10,
   },
   landing_screen: {
      marginTop: 20,
      height: 200,
      borderRadius: 25,
      backgroundColor: Colors.greenAvg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
   },
   text_landing_screen: {
      fontSize: widthDevice < 400 ? 18 : 20,
      color: Colors.white,
      fontWeight: 'bold',
   },
   content_in_landing_screen: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: Colors.greenWhite,
      width: '90%',
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
      fontSize: 20,
      flexWrap: 'wrap',
      textAlign: 'center',
   },
   /*image_poster_style_thematique: {
      height: 130,
      width: 230,
      borderRadius: 15,
   },*/
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
