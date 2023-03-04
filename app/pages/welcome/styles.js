import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '_theme/Colors';

const styles = StyleSheet.create({
   view_container_welcome: {
      flex: 1,
      backgroundColor: Colors.white,
      marginVertical: 30,
      paddingHorizontal: 20,
      alignItems: 'center',
   },
   images_welcome: {
      height: Dimensions.get('window').height < 700 ? 180 : 350,
      width: 300,
   },
   view_button_arrondi: {
      borderWidth: 2,
      borderColor: Colors.violet,
      borderRadius: 60,
      marginVertical: 20,
   },
   boutton_arrondi: {
      backgroundColor: Colors.violet,
      padding: 20,
      margin: 6,
      borderRadius: 60,
      minWidth: 34,
   },
});

export default styles;
