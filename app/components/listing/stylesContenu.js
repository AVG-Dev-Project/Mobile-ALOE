import { Colors } from '_theme/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      paddingHorizontal: 8,
      backgroundColor: Colors.background,
   },
   view_render: {
      marginVertical: 8,
      display: 'flex',
      flexDirection: 'row',
   },
});
