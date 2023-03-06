import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   Dimensions,
   SafeAreaView,
   TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
   nameStackNavigation as nameNav,
   filterArticleToListByContenu,
} from '_utils';
import { styles } from './stylesContenu';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';

export default function ListingContenu({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const allArticles = useSelector((selector) => selector.loi.articles);
   const dataForFlatList = route.params.dataToList;

   //all logics
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.listArticle, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Loi n°' : 'Lalana faha '
                  } ${item.numero}`,
                  allArticleRelatedTotheContenu: filterArticleToListByContenu(
                     item.id,
                     allArticles
                  ),
               });
            }}
         >
            <View style={styles.view_render}>
               <View>
                  <Text
                     style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                     }}
                  >
                     {langueActual === 'fr' ? 'Loi n°' : 'Lalana faha '}{' '}
                     {item.numero}
                  </Text>
                  <Text
                     style={{
                        fontSize:
                           Dimensions.get('window').height < 700 ? 10 : 12,
                        marginBottom: 8,
                        textTransform: 'capitalize',
                     }}
                  >
                     {langueActual === 'fr'
                        ? 'Publié le '
                        : "Nivoaka tamin'ny "}
                     {item.date}
                  </Text>
               </View>
               <Text
                  style={{
                     fontSize: Dimensions.get('window').height < 700 ? 14 : 16,
                     flex: 2,
                     textTransform: 'capitalize',
                  }}
                  numberOfLines={3}
               >
                  {langueActual === 'fr'
                     ? item.objet_contenu_fr
                     : item.objet_contenu_mg}{' '}
               </Text>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'flex-end',
                  }}
               >
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                     }}
                  >
                     <Text
                        style={{
                           fontSize: 14,
                           marginLeft: 2,
                        }}
                     >
                        {langueActual === 'fr'
                           ? item.thematique_nom_fr
                           : item.thematique_nom_mg}{' '}
                        {' / '}
                        {langueActual === 'fr'
                           ? item.type_nom_fr
                           : item.type_nom_mg}
                     </Text>
                  </View>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: 108,
                        justifyContent: 'flex-end',
                     }}
                  >
                     <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                           alert('PDF');
                        }}
                     >
                        <Icon
                           name={'file-download'}
                           color={Colors.violet}
                           size={28}
                        />
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      );
   }, []);

   const _idKeyExtractor = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   return (
      <View style={styles.view_container}>
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
               contentContainerStyle={{ paddingBottom: 10 }}
            />
         </SafeAreaView>
      </View>
   );
}
