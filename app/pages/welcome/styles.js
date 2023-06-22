import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '_theme/Colors';
import { widthPercentageToDP, heightPercentageToDP } from '_utils';

const styles = StyleSheet.create({
   view_container_welcome: {
      flex: 1,
      backgroundColor: Colors.white,
      paddingHorizontal: 4,
   },
   images_welcome: {
      height:
         Dimensions.get('window').height < 800
            ? heightPercentageToDP(20)
            : heightPercentageToDP(30),
      width:
         Dimensions.get('window').width < 800
            ? widthPercentageToDP(30)
            : widthPercentageToDP(40),
   },
   /*
   images_welcome: {
      height:
         Dimensions.get('window').height < 800
            ? heightPercentageToDP(20)
            : heightPercentageToDP(30),
      width:
         Dimensions.get('window').width < 800
            ? widthPercentageToDP(30)
            : widthPercentageToDP(40),
   },*/
   logo_image: {
      height: heightPercentageToDP(18),
      width: widthPercentageToDP(76),
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
      width: 75,
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
