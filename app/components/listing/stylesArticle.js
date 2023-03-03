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
   maskImageArticle: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 18,
      height: 160,
      width: 130,
   },
   number_of_article: {
      fontWeight: 'bold',
      color: Colors.white,
      fontSize: 44,
      marginVertical: 50,
      marginHorizontal: 50,
   },
});
