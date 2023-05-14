import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from '_utils';

const widthDevice = Dimensions.get('window').width;
export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      paddingTop: 20,
      marginBottom: 70,
      paddingHorizontal: 5,
      backgroundColor: Colors.background,
   },
   view_render: {
      marginVertical: 8,
      display: 'flex',
      flexDirection: 'row',
      height: 'auto',
   },
   head_content: {
      height: 45,
   },
   landing_screen: {
      marginTop: 8,
      height: heightPercentageToDP(25),
      borderRadius: 25,
      backgroundColor: Colors.greenAvg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
   },
   text_landing_screen: {
      fontSize: widthDevice < 370 ? 18 : 22,
      color: Colors.white,
      fontWeight: 'bold',
   },
   content_in_landing_screen: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-around',
      backgroundColor: Colors.greenWhite,
      width: '90%',
      paddingHorizontal: 0,
      paddingVertical: 20,
      borderRadius: 25,
   },
   icon_in_content_landing: {
      width: 42,
      height: 42,
      borderRadius: 62,
   },
   maskImageArticle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 18,
      height: 170,
      width: Dimensions.get('window').width < 380 ? 100 : 140,
   },
   number_of_article: {
      fontWeight: 'bold',
      color: Colors.white,
      fontSize: Dimensions.get('window').width < 380 ? 40 : 44,
      marginVertical: 50,
      marginHorizontal: Dimensions.get('window').width < 380 ? 30 : 50,
   },
});
