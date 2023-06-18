import { Colors } from '_theme/Colors';
import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
   view_container: {
      flex: 1,
      paddingHorizontal: 8,
      backgroundColor: Colors.background,
   },
   input: {
      borderWidth: 1,
      height: 40,
      paddingHorizontal: 10,
      borderRadius: 8,
   },
   view_search: {
      marginBottom: 6,
   },
   view_render: {
      marginVertical: 8,
      display: 'flex',
      flexDirection: 'row',
   },
   maskImageArticle: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: 18,
   },
   number_of_article: {
      fontWeight: 'bold',
      color: Colors.white,
      fontSize: Dimensions.get('window').width < 380 ? 40 : 44,
   },
   container_safe: {
      //marginBottom: 50,
      flex: 1,
   },
});
