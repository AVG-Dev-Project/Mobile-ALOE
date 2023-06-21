import {
   View,
   Text,
   TextInput,
   ActivityIndicator,
   TouchableOpacity,
   ToastAndroid,
   useWindowDimensions,
   ImageBackground,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { nameStackNavigation as nameNav } from '_utils/constante/NameStackNavigation';
import { styles } from './stylesArticle';
import { Icon, Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import {
   parseDataArticleLazyLoading,
   filterArticleToListByContenu,
   widthPercentageToDP,
   heightPercentageToDP,
   fetchArticlesByContenuToApi,
} from '_utils';
import {
   addFavoris,
   getAllArticles,
} from '_utils/redux/actions/action_creators';

const filterGlobal = (langueActual, array, query) => {
   let res = query === null ? [] : array;
   if (query) {
      if (langueActual === 'fr') {
         res = array.filter(
            (_article) =>
               _article.contenu_fr
                  ?.split('________________')[0]
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
               _article.chapitre_titre_fr
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _article.titre_fr?.toLowerCase().includes(query.toLowerCase())
         );
      }
      if (langueActual === 'mg') {
         res = array.filter(
            (_article) =>
               _article.contenu_mg
                  ?.split('________________')[0]
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
               _article.chapitre_titre_mg
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _article.titre_mg?.toLowerCase().includes(query.toLowerCase())
         );
      }
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
   const valueForDeepSearch = useSelector(
      (selector) => selector.fonctionnality.valueForDeepSearch
   );
   const idOfTheContenuMother = route.params.contenuMother?.id;
   const contenuMother = route.params.contenuMother;
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
   const [valueForSearch, setValueForSearch] = useState(
      valueForDeepSearch || ''
   );

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
      if (isGetNextData) {
         return;
      }
      setIsGetNextData(true);

      try {
         let res = await fetchArticlesByContenuToApi(
            idOfTheContenuMother,
            currentPage + 1
         );
         if (res.results?.length > 0) {
            setCurrentPage(currentPage + 1);
            setTotalPage(res.pages_count);
            let oldAllArticles = [...articleList];
            res.results?.map((result) => {
               if (
                  !oldAllArticles.find((article) => article.id === result.id)
               ) {
                  oldAllArticles.push(parseDataArticleLazyLoading(result));
               }
            });
            dispatch(getAllArticles(oldAllArticles));
            setArticleList(oldAllArticles);
         } else {
            setCurrentPage(totalPage || 1);
         }
      } catch (e) {
         ToastAndroid.show(
            langueActual === 'fr'
               ? 'Erreur survenu au télechargement des données.'
               : 'Nisy olana teo ampangalana ny angona.',
            ToastAndroid.SHORT
         );
      } finally {
         setIsGetNextData(false);
      }
   };

   const handleLoadMore = async () => {
      if (isConnectedToInternet && isNetworkActive) {
         if (!isGetNextData && currentPage < totalPage) {
            await getNextPageArticlesFromApi();
         }
      } else {
         ToastAndroid.show(
            `Pas de connexion, impossible d'obtenir des données supplémentaire`,
            ToastAndroid.SHORT
         );
         return;
      }
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

   //for deepSearch
   useFocusEffect(
      useCallback(() => {
         if (valueForSearch !== null) {
            setValueForSearch(valueForDeepSearch);
         }
      }, [valueForDeepSearch])
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
                     langueActual === 'fr' ? 'Article n°' : 'Andininy faha '
                  } ${item.numero}`,
                  articleToViewDetail: item,
               });
            }}
         >
            <View style={styles.view_render}>
               <ImageBackground
                  source={require('_images/abstract_3.jpg')}
                  blurRadius={5}
                  style={{
                     width: width < 380 ? 100 : 130,
                     height: 160,
                  }}
                  imageStyle={{
                     borderRadius: 16,
                  }}
               >
                  <View style={styles.maskImageArticle}>
                     <Text style={styles.number_of_article}>{item.numero}</Text>
                  </View>
               </ImageBackground>
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
                        {langueActual === 'fr' ? 'Article n°' : 'Andininy faha'}{' '}
                        {item.numero}
                     </Text>
                     <Text
                        style={{
                           fontSize: 12,
                           textDecorationLine: 'underline',
                           width: widthPercentageToDP(60),
                        }}
                        numberOfLines={1}
                     >
                        {langueActual === 'fr'
                           ? item.titre_fr
                           : item.titre_mg ?? item.titre_fr}
                     </Text>
                     {item.chapitre_titre_fr && (
                        <Text
                           style={{ fontSize: 12, width: width - 200 }}
                           numberOfLines={1}
                        >
                           {langueActual === 'fr'
                              ? `Chapitre ${item.chapitre_numero ?? ''}`
                              : `Toko faha ${item.chapitre_numero ?? ''}`}
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
                        fontSize: heightPercentageToDP(2),
                        flex: 2,
                        width: widthPercentageToDP(60),
                     }}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr'
                        ? item.contenu_fr?.split('________________')[0]
                        : item.contenu_mg?.split('________________')[0] ??
                          'Tsy misy dikan-teny malagasy ito andininy iray ito.'}
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
                                 fontSize: widthPercentageToDP(3.5),
                                 marginLeft: 2,
                              }}
                           >
                              {langueActual === 'fr' ? 'Favoris' : 'Safidy'}
                           </Text>
                        ) : (
                           <Text
                              style={{
                                 fontSize: widthPercentageToDP(3.5),
                                 marginLeft: 2,
                              }}
                           >
                              {langueActual === 'fr'
                                 ? 'Pas dans favoris'
                                 : 'Tsy safidy'}
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
                     ? 'Entrer un mot-clé...'
                     : 'Teny hotadiavina...'
               }
               value={valueForSearch}
               onChangeText={(text) => {
                  setValueForSearch(text);
               }}
            />
            <View style={styles.button_after_inputSearch}>
               {contenuMother.en_tete_contenu_fr && (
                  <Button
                     title="VISA"
                     icon={{
                        name: 'article',
                        type: 'material',
                        size: 20,
                        color: Colors.white,
                     }}
                     titleStyle={{ fontSize: 16 }}
                     buttonStyle={{
                        borderRadius: 15,
                        backgroundColor: Colors.greenAvg,
                     }}
                     containerStyle={styles.button_entete}
                     onPress={() => {
                        navigation.navigate(nameNav.detailEntete, {
                           titleScreen: `${
                              langueActual === 'fr' ? 'VISA' : 'Fahazoan-dalàna'
                           }`,
                           contenuMother: contenuMother,
                           typeOfData: 'VISA',
                        });
                     }}
                  />
               )}
               {contenuMother.expose_des_motifs_contenu_fr && (
                  <Button
                     title="Exposé des motifs"
                     icon={{
                        name: 'description',
                        type: 'material',
                        size: 20,
                        color: Colors.white,
                     }}
                     titleStyle={{ fontSize: 16 }}
                     buttonStyle={{
                        borderRadius: 15,
                        backgroundColor: Colors.greenAvg,
                     }}
                     containerStyle={{ flex: 2 }}
                     onPress={() => {
                        navigation.navigate(nameNav.detailEntete, {
                           titleScreen: `${
                              langueActual === 'fr'
                                 ? 'Exposé des motifs'
                                 : 'Famelabelarana ny antonantony'
                           }`,
                           contenuMother: contenuMother,
                           typeOfData: 'Exposer',
                        });
                     }}
                  />
               )}
               {contenuMother.note_contenu_fr && (
                  <Button
                     title="Notes"
                     icon={{
                        name: 'notes',
                        type: 'material',
                        size: 20,
                        color: Colors.white,
                     }}
                     titleStyle={{ fontSize: 16 }}
                     buttonStyle={{
                        borderRadius: 15,
                        backgroundColor: Colors.greenAvg,
                     }}
                     containerStyle={styles.button_entete}
                     onPress={() => {
                        navigation.navigate(nameNav.detailEntete, {
                           titleScreen: `${
                              langueActual === 'fr' ? 'Notes' : 'Naoty'
                           }`,
                           contenuMother: contenuMother,
                           typeOfData: 'Note',
                        });
                     }}
                  />
               )}
            </View>
         </View>
         <View style={styles.container_safe}>
            <FlashList
               data={articleList}
               key={'_'}
               keyExtractor={_idKeyExtractor}
               renderItem={_renderItem}
               estimatedItemSize={100}
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
                           ? 'Aucun article'
                           : 'Tsy misy andininy'}
                     </Text>
                  </View>
               }
               extraData={articleList}
               onEndReachedThreshold={0.5}
               onEndReached={() => {
                  if (!isGetNextData && currentPage < totalPage) {
                     handleLoadMore();
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
         </View>
      </View>
   );
}
