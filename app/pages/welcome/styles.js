import { StyleSheet } from 'react-native';
import { Colors } from '_theme/Colors';
import { widthPercentageToDP, heightPercentageToDP } from '_utils';

const styles = StyleSheet.create({
   view_container_welcome: {
      flex: 1,
      backgroundColor: Colors.white,
   },
   images_welcome: {
      height: heightPercentageToDP(38),
      width: widthPercentageToDP(60),
   },
   logo_image: {
      height: heightPercentageToDP(8),
      width: widthPercentageToDP(48),
   },
   view_button_arrondi: {
      borderWidth: 2,
      borderColor: Colors.greenAvg,
      borderRadius: 60,
      marginVertical: 20,
   },
   bouttonStyle: {
      backgroundColor: Colors.greenAvg,
      padding: 20,
      margin: 6,
      borderRadius: 60,
      width: widthPercentageToDP(18),
      height: 75,
   },
   boutton_arrondi: {
      backgroundColor: Colors.greenAvg,
      padding: 20,
      margin: 6,
      borderRadius: 60,
      minWidth: widthPercentageToDP(12),
   },
   viewPartenaire: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
   },
   labelDescriptionLogoUsaid: {
      fontSize: 12,
      fontWeight: 'bold',
   },
});

export default styles;
