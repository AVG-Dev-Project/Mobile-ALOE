import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      paddingHorizontal: 8,
      backgroundColor: Colors.background,
   },
   view_render: {
      height: 160,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: Colors.whiteRose,
      marginVertical: 5,
      padding: 10,
      backgroundColor: Colors.whiteRose,
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
});
