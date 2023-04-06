import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   SafeAreaView,
   TouchableOpacity,
   useWindowDimensions,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import RenderHtml from 'react-native-render-html';
import { nameStackNavigation as nameNav } from '_utils/constante/NameStackNavigation';
import { styles } from './stylesArticle';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import { LoiService, parseStructureDataForArticle } from '_utils';
import {
   addFavoris,
   getAllArticles,
} from '_utils/redux/actions/action_creators';

export default function ListingArticle({ navigation, route }) {
   //all data
   let currentPage = 0;
   let totalPage = 1;
   const dispatch = useDispatch();
   const { width } = useWindowDimensions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const allFavoriteIdFromStore = useSelector(
      (selector) => selector.loi.favoris
   );
   const dataFromParams = route.params.allArticleRelatedTotheContenu;
   const idOfTheContenuMother = route.params.idOfThisContenu;
   const [articleList, setArticleList] = useState(
      dataFromParams.map((item) => {
         return {
            ...item,
            isFavorite: allFavoriteIdFromStore.includes(item.id),
         };
      })
   );

   const tagsStyles = {
      p: {
         width: '40%',
         fontSize: width < 370 ? 12 : 14,
      },
   };

   //all function
   const sourceHTML = (data) => {
      const source = {
         html: data,
      };
      return source;
   };

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
      let res = await LoiService.getArticlesByContenuFromServ(
         idOfTheContenuMother,
         currentPage + 1
      );
      currentPage += 1;
      totalPage = res.pages_count;
      let oldAllArticles = [...articleList];
      res.results.map((result) => {
         if (!oldAllArticles.find((article) => article.id === result.id)) {
            console.log('tsy find e :', result.id);
            oldAllArticles.push(result);
         }
      });
      setArticleList(oldAllArticles);
      dispatch(getAllArticles(oldAllArticles));
   };

   //all effects

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
                     marginLeft: 12,
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                  }}
               >
                  <View>
                     <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {langueActual === 'fr' ? 'Article n°' : 'Lahatsoratra '}{' '}
                        {item.numero}
                     </Text>
                     <Text
                        style={{
                           fontSize: 12,
                           textDecorationLine: 'underline',
                        }}
                        numberOfLines={1}
                     >
                        {langueActual === 'fr' ? item.titre_fr : item.titre_mg}
                     </Text>
                     {item.chapitre_id && (
                        <Text style={{ fontSize: 12 }}>
                           {langueActual === 'fr'
                              ? `Chapitre ${item.chapitre_numero ?? ''}`
                              : `Lohateny ${item.chapitre_numero ?? ''}`}
                           : {item.chapitre_titre_fr ?? ''}
                        </Text>
                     )}
                  </View>
                  <Text
                     style={{
                        fontSize: width < 380 ? 8 : 16,
                        flex: 2,
                        width: 210,
                     }}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr'
                        ? item.contenu_fr?.split('________________')[0]
                        : item.contenu_mg?.split('________________')[0]}
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
                  console.log('starting onreached  .......');
                  console.log('totalPage on reach: ', totalPage);
                  console.log('current page before: ', currentPage);
                  if (currentPage < totalPage) {
                     console.log('mbola tsy page farany +++++++');
                     console.log('start fetch data next -----------');
                     await getNextPageArticlesFromApi();
                  }
                  console.log('totalPage after fetching :******** ', totalPage);
                  console.log('current page after: ', currentPage);
               }}
            />
         </SafeAreaView>
      </View>
   );
}
