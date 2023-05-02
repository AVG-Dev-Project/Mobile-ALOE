import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '_theme/Colors';

const styles = StyleSheet.create({
   view_container_welcome: {
      flex: 1,
      backgroundColor: Colors.white,
      paddingHorizontal: 20,
      alignItems: 'center',
   },
   images_welcome: {
      height: Dimensions.get('window').height - 430,
      width: Dimensions.get('window').width - 160,
   },
   logo_image: {
      height: 50,
      width: Dimensions.get('window').height < 700 ? 130 : 150,
   },
   view_button_arrondi: {
      borderWidth: 2,
      borderColor: Colors.greenAvg,
      borderRadius: 60,
      marginVertical: 20,
   },
   boutton_arrondi: {
      backgroundColor: Colors.greenAvg,
      padding: 20,
      margin: 6,
      borderRadius: 60,
      minWidth: 34,
   },
});

export default styles;
