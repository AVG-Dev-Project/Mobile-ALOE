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
import { cutTextWithBalise } from '_utils';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function ListingArticle({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const { width } = useWindowDimensions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const allFavoriteId = useSelector((selector) => selector.loi.favoris);
   const dataForFlatList = route.params.allArticleRelatedTotheContenu;

   //all function
   const sourceHTML = (data) => {
      const source = {
         html: data,
      };
      return source;
   };

   const tagsStyles = {
      p: {
         width: '40%',
         fontSize: width < 370 ? 12 : 14,
      },
   };

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
                     width: width < 380 ? 100 : 140,
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
                     {langueActual === 'fr' ? (
                        <RenderHtml
                           contentWidth={width}
                           source={sourceHTML(
                              cutTextWithBalise(item.contenu_fr, 700)
                           )}
                           tagsStyles={tagsStyles}
                        />
                     ) : (
                        <RenderHtml
                           contentWidth={width}
                           source={sourceHTML(
                              cutTextWithBalise(item.contenu_mg, 700)
                           )}
                           tagsStyles={tagsStyles}
                        />
                     )}
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
                              allFavoriteId.includes(item.id)
                                 ? 'sentiment-very-satisfied'
                                 : 'sentiment-very-dissatisfied'
                           }
                           color={
                              allFavoriteId.includes(item.id)
                                 ? Colors.greenAvg
                                 : Colors.redError
                           }
                           size={18}
                        />
                        {allFavoriteId.includes(item.id) ? (
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
                           dispatch(addFavoris(item.id));
                        }}
                     >
                        <Icon
                           name={
                              allFavoriteId.includes(item.id)
                                 ? 'favorite'
                                 : 'favorite-border'
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
            />
         </SafeAreaView>
      </View>
   );
}
