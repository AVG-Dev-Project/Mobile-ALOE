import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   TextInput,
   SafeAreaView,
   ActivityIndicator,
   TouchableOpacity,
   ToastAndroid,
   useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { nameStackNavigation as nameNav } from '_utils/constante/NameStackNavigation';
import { styles } from './stylesArticle';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import {
   parseDataArticleLazyLoading,
   filterArticleToListByContenu,
   fetchArticlesByContenuToApi,
} from '_utils';
import {
   addFavoris,
   getAllArticles,
} from '_utils/redux/actions/action_creators';

const filterGlobal = (langueActual, array, query) => {
   let res = array;
   if (query) {
      langueActual === 'fr'
         ? (res = res.filter((_loi) =>
              _loi.contenu_fr
                 ?.split('________________')[0]
                 .toLowerCase()
                 .includes(query.toLowerCase())
           ))
         : (res = res.filter((_loi) =>
              _loi.contenu_mg
                 ?.split('________________')[0]
                 .toLowerCase()
                 .includes(query.toLowerCase())
           ));
   }

   return res;
};

export default function ListingArticle({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const { width } = useWindowDimensions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const isNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const allArticles = useSelector((selector) => selector.loi.articles);

   const [totalPage, setTotalPage] = useState(1);
   const [currentPage, setCurrentPage] = useState(0);
   const allFavoriteIdFromStore = useSelector(
      (selector) => selector.loi.favoris
   );
   const idOfTheContenuMother = route.params.idOfThisContenu;
   const [isGetNextData, setIsGetNextData] = useState(false);
   const [articleList, setArticleList] = useState(
      filterArticleToListByContenu(idOfTheContenuMother, allArticles).map(
         (item) => {
            return {
               ...item,
               isFavorite: allFavoriteIdFromStore.includes(item.id),
            };
         }
      )
   );
   const [valueForSearch, setValueForSearch] = useState('');

   //all functions
   const handleToogleIsFavorite = (id) => {
      dispatch(addFavoris(id));
      // Mettre à jour la propriété isFavorite de l'article avec l'ID donné
      setArticleList((prevList) =>
         prevList.map((item) =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
         )
      );
   };

   const getNextPageArticlesFromApi = async () => {
      let res = await fetchArticlesByContenuToApi(
         idOfTheContenuMother,
         currentPage + 1
      );
      setCurrentPage(currentPage + 1);
      setTotalPage(res.pages_count);
      let oldAllArticles = [...articleList];
      res.results.map((result) => {
         if (!oldAllArticles.find((article) => article.id === result.id)) {
            oldAllArticles.push(parseDataArticleLazyLoading(result));
         }
      });
      dispatch(getAllArticles(oldAllArticles));
      setArticleList(oldAllArticles);
      setIsGetNextData(false);
   };

   //all effects
   useFocusEffect(
      useCallback(() => {
         setArticleList((prevList) =>
            prevList.map((item) => {
               return {
                  ...item,
                  isFavorite: allFavoriteIdFromStore.includes(item.id),
               };
            })
         );
      }, [allFavoriteIdFromStore])
   );

   useFocusEffect(
      useCallback(() => {
         if (articleList.length <= 0) {
            getNextPageArticlesFromApi();
         }
      }, [articleList])
   );

   useEffect(() => {
      if (valueForSearch) {
         setArticleList(
            filterGlobal(langueActual, articleList, valueForSearch).map(
               (item) => {
                  return {
                     ...item,
                     isFavorite: allFavoriteIdFromStore.includes(item.id),
                  };
               }
            )
         );
      } else {
         setArticleList(
            filterArticleToListByContenu(idOfTheContenuMother, allArticles).map(
               (item) => {
                  return {
                     ...item,
                     isFavorite: allFavoriteIdFromStore.includes(item.id),
                  };
               }
            )
         );
      }
   }, [valueForSearch]);

   //all components
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.detailPage, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Article n°' : 'Lahatsoratra '
                  } ${item.numero}`,
                  articleToViewDetail: item,
               });
            }}
         >
            <View style={styles.view_render}>
               <Image
                  source={require('_images/book_loi.jpg')}
                  style={{
                     width: width < 380 ? 100 : 130,
                     height: 160,
                     borderRadius: 16,
                  }}
               />
               <View
                  style={[
                     StyleSheet.absoluteFillObject,
                     styles.maskImageArticle,
                  ]}
               ></View>
               <Text
                  style={[
                     StyleSheet.absoluteFillObject,
                     styles.number_of_article,
                  ]}
               >
                  {item.numero}
               </Text>
               <View
                  style={{
                     marginLeft: 8,
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                  }}
               >
                  <View>
                     <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {langueActual === 'fr'
                           ? 'Article n°'
                           : 'Lahatsoratra faha'}{' '}
                        {item.numero}
                     </Text>
                     <Text
                        style={{
                           fontSize: 12,
                           textDecorationLine: 'underline',
                           width: width - 180,
                        }}
                        numberOfLines={1}
                     >
                        {langueActual === 'fr'
                           ? item.titre_fr
                           : item.titre_mg ?? item.titre_fr}
                     </Text>
                     {item.chapitre_id && (
                        <Text
                           style={{ fontSize: 12, width: width - 200 }}
                           numberOfLines={1}
                        >
                           {langueActual === 'fr'
                              ? `Chapitre ${item.chapitre_numero ?? ''}`
                              : `Lohateny ${item.chapitre_numero ?? ''}`}
                           :{' '}
                           {langueActual === 'fr'
                              ? item.chapitre_titre_fr
                              : item.chapitre_titre_mg ??
                                item.chapitre_titre_fr}
                        </Text>
                     )}
                  </View>
                  <Text
                     style={{
                        fontSize: width < 380 ? 10 : 16,
                        flex: 2,
                        width: 210,
                     }}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr'
                        ? item.contenu_fr?.split('________________')[0]
                        : item.contenu_mg?.split('________________')[0] ??
                          'Tsy misy dikan-teny malagasy ito lahatsoratra iray ito.'}
                     {' ...'}
                  </Text>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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
                           name={
                              item.isFavorite
                                 ? 'sentiment-very-satisfied'
                                 : 'sentiment-very-dissatisfied'
                           }
                           color={
                              item.isFavorite
                                 ? Colors.greenAvg
                                 : Colors.redError
                           }
                           size={18}
                        />
                        {item.isFavorite ? (
                           <Text
                              style={{
                                 fontSize: 14,
                                 marginLeft: 2,
                              }}
                           >
                              {langueActual === 'fr' ? 'Favoris' : 'Ankafizina'}
                           </Text>
                        ) : (
                           <Text
                              style={{
                                 fontSize: 14,
                                 marginLeft: 2,
                              }}
                           >
                              {langueActual === 'fr'
                                 ? 'Pas dans favoris'
                                 : 'Tsy mbola anaty ankafizina'}
                           </Text>
                        )}
                     </View>
                     <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                           handleToogleIsFavorite(item.id);
                        }}
                     >
                        <Icon
                           name={
                              item.isFavorite ? 'favorite' : 'favorite-border'
                           }
                           color={Colors.redError}
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
         <View style={styles.view_search}>
            <TextInput
               style={styles.input}
               keyboardType="default"
               placeholder={
                  langueActual === 'fr'
                     ? 'Entrer le mot de recherche ...'
                     : 'Ampidiro ny teny hotadiavina...'
               }
               value={valueForSearch}
               onChangeText={(text) => {
                  setValueForSearch(text);
               }}
            />
         </View>
         <SafeAreaView style={styles.container_safe}>
            <FlatList
               data={articleList}
               key={'_'}
               keyExtractor={_idKeyExtractor}
               renderItem={_renderItem}
               removeClippedSubviews={true}
               getItemLayout={(data, index) => ({
                  length: data.length,
                  offset: data.length * index,
                  index,
               })}
               ListEmptyComponent={
                  <View
                     style={{
                        display: 'flex',
                        borderWidth: 1,
                        padding: 16,
                        marginVertical: 28,
                        borderRadius: 19,
                        borderColor: Colors.redError,
                     }}
                  >
                     <Text
                        style={{
                           textAlign: 'center',
                           fontSize: width < 370 ? 22 : 28,
                           color: Colors.redError,
                        }}
                     >
                        {langueActual === 'fr'
                           ? "Pas d'articles"
                           : 'Tsy misy lahatsoratra'}
                     </Text>
                  </View>
               }
               extraData={articleList}
               onEndReachedThreshold={0.5}
               onEndReached={async () => {
                  if (isConnectedToInternet && isNetworkActive) {
                     if (currentPage < totalPage) {
                        setIsGetNextData(true);
                        console.log('gte next e :');
                        await getNextPageArticlesFromApi();
                     }
                  } else {
                     ToastAndroid.show(
                        `Pas de connexion, impossible d'obtenir des datas suppl!`,
                        ToastAndroid.SHORT
                     );
                     return;
                  }
               }}
               ListFooterComponent={
                  isGetNextData && (
                     <View>
                        <ActivityIndicator
                           size="large"
                           color={Colors.greenAvg}
                        />
                     </View>
                  )
               }
            />
         </SafeAreaView>
      </View>
   );
}
