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
      backgroundColor: Colors.violet,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
   },
   text_landing_screen: {
      fontSize: 22,
      color: Colors.white,
      fontWeight: 'bold',
   },
   content_in_landing_screen: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-around',
      backgroundColor: Colors.whiteRose,
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
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 18,
      height: 80,
      width: 230,
   },
   view_carousel: {
      width: '100%',
      flexDirection: 'row',
   },

   text_descriptif_for_carousel: {
      fontWeight: 'bold',
      opacity: 0.9,
      color: Colors.white,
      marginHorizontal: 2,
      fontSize: 20,
      flexWrap: 'wrap',
      textAlign: 'center',
      top: 28,
   },
   image_poster_style_type: {
      height: 80,
      width: 230,
      borderRadius: 15,
   },
});
