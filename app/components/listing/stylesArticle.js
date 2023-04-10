import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

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
      width: Dimensions.get('window').width < 380 ? 100 : 130,
   },
   number_of_article: {
      fontWeight: 'bold',
      color: Colors.white,
      fontSize: Dimensions.get('window').width < 380 ? 40 : 44,
      marginVertical: 50,
      marginHorizontal: Dimensions.get('window').width < 380 ? 30 : 50,
   },
});
