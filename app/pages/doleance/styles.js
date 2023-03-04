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
      marginVertical: 18,
   },
   banniere_image: {
      width: Dimensions.get('window').width < 370 ? 200 : 350,
      height: Dimensions.get('window').height < 700 ? 170 : 220,
   },
   content_form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },
   champ_message: {
      borderWidth: 1,
      width: '100%',
      height: 150,
      fontSize: 16,
      marginHorizontal: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
   },
});
