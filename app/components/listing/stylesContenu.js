import { Colors } from '_theme/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: Colors.background,
   },
   view_flatList: {
      height: '100%',
   },
   view_render: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: Colors.greenWhite,
      marginTop: 8,
      marginBottom: 4,
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
});
