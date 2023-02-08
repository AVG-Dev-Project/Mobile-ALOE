import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   Modal,
   SafeAreaView,
   TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { nameStackNavigation as nameNav } from '_utils/constante/NameStackNavigation';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function Listing({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   let allArticle = useSelector((selector) => selector.article.articles);
   let dataPerThemeAndType = [];
   if (langueActual === 'fr') {
      dataPerThemeAndType = allArticle.filter(
         (article) =>
            article.Thematique.nom_Thematique_fr === route.params.theme &&
            article.Type.nom_Type_fr === route.params.type
      );
   } else {
      dataPerThemeAndType = allArticle.filter(
         (article) =>
            article.Thematique.nom_Thematique_mg === route.params.theme &&
            article.Type.nom_Type_mg === route.params.type
      );
   }
   const dataForFlatList = route.params.dataToList ?? dataPerThemeAndType;

   //all logics
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.detailPage, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Article n°' : 'Lahatsoratra '
                  } ${item.Article.numero_Article}`,
                  articleToViewDetail: item,
               });
            }}
         >
            <View style={styles.view_render}>
               <Image
                  source={item.photo ?? require('_images/book_loi.jpg')}
                  style={{ width: 130, height: 150, borderRadius: 16 }}
               />
               <View
                  style={{
                     marginLeft: 12,
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                  }}
               >
                  <View>
                     <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {langueActual === 'fr' ? 'Article n°' : 'Lahatsoratra '}{' '}
                        {item.Article.numero_Article}
                     </Text>
                     <Text style={{ fontSize: 12, marginBottom: 8 }}>
                        {langueActual === 'fr' ? 'Publié le ' : 'Nivoaka ny '}:{' '}
                        {item.date_created?.substring(0, 10)}
                     </Text>
                  </View>
                  <Text
                     style={{ fontSize: 16, flex: 2, width: 210 }}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr'
                        ? item.Article.contenu_Article_fr
                        : item.Article.contenu_Article_mg}{' '}
                  </Text>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: 140,
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
                        <Icon
                           name={'sentiment-very-dissatisfied'}
                           color={Colors.orange}
                           size={18}
                        />
                        <Text
                           style={{
                              fontSize: 14,
                              marginLeft: 2,
                           }}
                        >
                           {langueActual === 'fr'
                              ? 'Pas encore lu'
                              : 'Tsy voavaky'}
                        </Text>
                     </View>
                     <View
                        style={{
                           display: 'flex',
                           flexDirection: 'row',
                           width: 108,
                           justifyContent: 'space-evenly',
                        }}
                     >
                        <TouchableOpacity
                           activeOpacity={0.8}
                           onPress={() => {
                              alert('PDF');
                           }}
                        >
                           <Icon
                              name={'picture-as-pdf'}
                              color={Colors.violet}
                              size={28}
                           />
                        </TouchableOpacity>
                        <TouchableOpacity
                           activeOpacity={0.8}
                           onPress={() => {
                              dispatch(addFavoris(item));
                              alert(
                                 langueActual === 'fr'
                                    ? 'Ajouté au favoris.'
                                    : "Nampiana tao amin'ny ankafizina"
                              );
                           }}
                        >
                           <Icon
                              name={'favorite-border'}
                              color={Colors.orange}
                              size={28}
                           />
                        </TouchableOpacity>
                     </View>
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
            {dataForFlatList.length > 0 ? (
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
               />
            ) : (
               <View
                  style={{
                     display: 'flex',
                     borderWidth: 1,
                     padding: 18,
                     marginVertical: 28,
                  }}
               >
                  <Text style={{ textAlign: 'center', fontSize: 32 }}>
                     {langueActual === 'fr'
                        ? 'Pas de données'
                        : 'Tsy misy tahirin-kevitra'}
                  </Text>
               </View>
            )}
         </SafeAreaView>
      </View>
   );
}
