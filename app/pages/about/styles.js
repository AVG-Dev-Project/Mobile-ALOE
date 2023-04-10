import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      marginBottom: 50,
      paddingTop: 18,
      paddingHorizontal: 15,
      backgroundColor: Colors.background,
   },
   head_banniere: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
   },
   banniere_image: {
      width: widthDevice - 150,
      height: heightDevice - 400,
   },
   view_content_about: {
      marginVertical: 20,
   },
   button_link_about: {
      paddingVertical: 20,
      marginHorizontal: 8,
      borderTopWidth: 1,
      fontSize: 16,
      borderColor: Colors.grey,
   },
});
