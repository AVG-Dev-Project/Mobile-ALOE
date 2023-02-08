import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   SafeAreaView,
   TouchableOpacity,
} from 'react-native';
import React from 'react';
import { nameStackNavigation as nameNav } from '_utils/constante/NameStackNavigation';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';

import { Colors } from '_theme/Colors';

export default function ListingTypes({ navigation, route }) {
   const dataForFlatList = useSelector((selector) => selector.article.types);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const _renderItem = ({ item }) => {
      return (
         <View style={styles.view_render} key={item.id}>
            <TouchableOpacity
               onPress={() => {
                  navigation.navigate(nameNav.listPage, {
                     titleScreen: `${
                        langueActual === 'fr' ? item.nom : item.nom_mg
                     }`,
                     type: langueActual === 'fr' ? item.nom : item.nom_mg,
                     theme: route.params.domaine,
                  });
               }}
            >
               <Image
                  style={styles.poster_catg}
                  source={require('_images/book_loi.jpg')}
               />
               <View
                  style={[StyleSheet.absoluteFillObject, styles.maskImageCatg]}
               ></View>
               <Text style={[StyleSheet.absoluteFillObject, styles.nom_catg]}>
                  {langueActual === 'fr' ? item.nom : item.nom_mg}
               </Text>
            </TouchableOpacity>
         </View>
      );
   };

   const _idKeyExtractor = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   return (
      <View style={styles.view_container_ctg}>
         <SafeAreaView style={styles.container_safe}>
            <FlatList
               data={dataForFlatList}
               key={'_'}
               keyExtractor={_idKeyExtractor}
               renderItem={_renderItem}
               removeClippedSubviews={true}
               getItemLayout={(data, index) => ({
                  length: data.length,
                  offset: data.length * index,
                  index,
               })}
               initialNumToRender={5}
               maxToRenderPerBatch={3}
               numColumns={2}
            />
         </SafeAreaView>
      </View>
   );
}
