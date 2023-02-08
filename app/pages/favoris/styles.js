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
   view_render: {
      marginVertical: 8,
      display: 'flex',
      flexDirection: 'row',
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
});
