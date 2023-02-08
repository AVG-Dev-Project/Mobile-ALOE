import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '_theme/Colors';

let widthDevice = Dimensions.get('window').width;

export const styles = StyleSheet.create({
   view_container_ctg: {
      flex: 1,
      marginVertical: 10,
      paddingHorizontal: 8,
      backgroundColor: Colors.background,
   },
   view_render: {
      marginVertical: 4,
      marginHorizontal: 8,
      display: 'flex',
      flexDirection: 'row',
      width: widthDevice < 370 ? 155 : 170,
   },
   poster_catg: {
      height: 90,
      width: widthDevice < 370 ? 155 : 170,
      borderRadius: 20,
   },
   maskImageCatg: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 18,
      width: widthDevice < 370 ? 155 : 170,
   },
   nom_catg: {
      fontWeight: 'bold',
      opacity: 0.9,
      color: Colors.white,
      marginHorizontal: 2,
      fontSize: 20,
      flexWrap: 'wrap',
      textAlign: 'center',
      top: 28,
   },
});
