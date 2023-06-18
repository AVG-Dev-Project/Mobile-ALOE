import { Colors } from '_theme/Colors';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from '_utils';

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
      resizeMode: 'contain',
      width: widthPercentageToDP(60),
      height: heightPercentageToDP(40),
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
