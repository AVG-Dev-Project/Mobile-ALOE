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
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
   },
});