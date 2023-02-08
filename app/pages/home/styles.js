import { Colors } from '_theme/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      marginTop: 30,
      marginBottom: 80,
      paddingHorizontal: 15,
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
      alignItems: 'center'
   },
   text_landing_screen: {
      fontSize: 22,
      color: Colors.white,
      fontWeight: 'bold'
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
   /*Thematique*/
   one_item_categorie: {
      width: 60,
      height: 90,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center'
   },
   image_for_categorie: {
      width: 60,
      height: 60,
      borderRadius: 60
   },
   /*Types*/
   one_item_type: {
      width: 60,
      height: 90,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center'
   },
   image_for_types: {
      width: 80,
      height: 70,
      borderRadius: 20
   },
   view_carousel: {
      width: '100%',
      flexDirection: 'row',
   },
   image_poster_style: {
      height: 130,
      width: 230,
      borderRadius: 15,
   },
});
