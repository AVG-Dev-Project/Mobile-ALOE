import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '_theme/Colors';

const styles = StyleSheet.create({
   view_container_download: {
      flex: 1,
      backgroundColor: Colors.white,
      marginVertical: 30,
      paddingHorizontal: 20,
      alignItems: 'center',
   },
   images_welcome: {
      height: Dimensions.get('window').height < 700 ? 250 : 300,
      width: 300,
   },
   view_status_connexion: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
   },
   view_instruction: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
   },
   view_for_button: {
      marginVertical: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
   },
});

export default styles;
