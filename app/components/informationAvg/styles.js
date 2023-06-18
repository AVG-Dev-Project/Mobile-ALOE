import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from '_utils';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.background,
   },
   info_header: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 20,
      justifyContent: 'center',
      alignItems: 'flex-start',
   },
   map: {
      width: widthPercentageToDP(85),
      height: heightPercentageToDP(30),
   },
   view_head_information: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: heightPercentageToDP(10),
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
