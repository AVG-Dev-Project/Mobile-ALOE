import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.background,
   },
   map: {
      width: Dimensions.get('window').width - 50,
      height:
         Dimensions.get('window').height < 700
            ? Dimensions.get('window').height - 450
            : Dimensions.get('window').height - 600,
   },
   view_head_information: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: Dimensions.get('window').width < 370 ? 60 : 80,
      marginBottom: 30,
   },
   view_adresse: {
      marginTop: 10,
      width: '87%',
   },
   txt_label: {
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').width < 370 ? 15 : 16,
      textTransform: 'uppercase',
      marginTop: 6,
   },
   txt_value: {
      marginBottom: 8,
   },
   all_buttons_links: {
      width: Dimensions.get('window').width < 370 ? '90%' : '80%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
});
