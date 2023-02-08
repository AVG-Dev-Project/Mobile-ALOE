import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      marginTop: 30,
      marginBottom: 50,
      paddingTop: 20,
      paddingHorizontal: 15,
      backgroundColor: Colors.background,
   },
   head_banniere: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
   },
   banniere_image: {
      width: Dimensions.get('window').width < 370 ? 300 : 350,
      height: Dimensions.get('window').height < 700 ? 270 : 320,
   },
   view_content_about: {
      marginVertical: 28,
   },
   button_link_about: {
      paddingVertical: 22,
      marginHorizontal: 8,
      borderTopWidth: 1,
      fontSize: 16,
      borderColor: Colors.grey,
   },
});
