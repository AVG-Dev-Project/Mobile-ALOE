import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

const widthDevice = Dimensions.get('window').width;
export const styles = StyleSheet.create({
   view_container_search: {
      flex: 1,
      marginTop: 8,
      paddingBottom: 70,
      paddingHorizontal: 15,
      backgroundColor: Colors.background,
   },
   head_content: {
      marginTop: 10,
   },
   labelTags: {
      paddingBottom: 6
   },
   view_carousel: {
      width: '100%',
      flexDirection: 'column',
      //backgroundColor: Colors.greenWhite,
   },
   view_for_filtre: {
      //backgroundColor: Colors.greenWhite,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
   },
   view_in_filtre: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },
   view_for_input_search: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 4,
   },
   input: {
      borderWidth: 1,
      padding: widthDevice < 370 ? 12 : 16,
      width: widthDevice < 370 ? 270 : '83.8%',
      borderRightWidth: 0,
   },
   boutton_search: {
      borderWidth: 1,
      width: 60,
      padding: 16,
      borderLeftWidth: 0,
   },
   boutton_search_on: {
      borderWidth: 1,
      width: 60,
      height: 62,
      borderLeftWidth: 0,
   },
   view_render: {
      height: 210,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: Colors.greenWhite,
      marginVertical: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: Colors.greenWhite,
      marginHorizontal: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      shadowColor: Colors.black,
      shadowOffset: {
         width: 3,
         height: 5,
      },
      shadowOpacity: 0.21,
      shadowRadius: 7.68,
      elevation: 7,
   },
   view_bottom_sheet: {
      backgroundColor: '#f2f2f2',
   },
   view_in_bottomsheet: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      backgroundColor: '#f2f2f2',
      marginHorizontal: 8,
      paddingHorizontal: 18,
   },
   vocal_off: {
      margin: 0,
      padding: 0,
      height: 46,
   },
   view_chips: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.greenAvg
   },
   item_chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      fontWeight: 'bold'
   }
});
