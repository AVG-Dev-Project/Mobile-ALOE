import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   Dimensions,
   SafeAreaView,
   ToastAndroid,
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
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Colors } from '_theme/Colors';

export default function ListingContenu({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const allArticles = useSelector((selector) => selector.loi.articles);
   const dataForFlatList = route.params.dataToList;
   const urlApiAttachement = 'https://avg.e-commerce-mg.com';
   const [contenuList, setContenuList] = useState(
      dataForFlatList.map((item) => {
         return {
            ...item,
            isPdfDownloading: false,
         };
      })
   );

   //all functions
   const downloadPdfFile = async (contenu, linkPdf) => {
      const downloadResumable = FileSystem.createDownloadResumable(
         urlApiAttachement + linkPdf,
         FileSystem.documentDirectory + linkPdf?.slice(19)
      );

      try {
         const { uri } = await downloadResumable.downloadAsync();
         const asset = await MediaLibrary.createAssetAsync(uri);
         const album = await MediaLibrary.getAlbumAsync('Download');
         if (album === null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
         } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            ToastAndroid.show(
               `${
                  langueActual === 'fr'
                     ? contenu.type_nom_fr
                     : contenu.type_nom_mg
               } n° ${contenu.numero} télecharger dans votre télephone!`,
               ToastAndroid.SHORT
            );
            handleToogleIsDownloading(contenu.id);
         }
      } catch (e) {
         ToastAndroid.show(
            'Erreur durant le télechargement du pdf',
            ToastAndroid.LONG
         );
         console.log(e);
      }
   };

   const handleToogleIsDownloading = (id) => {
      // Mettre à jour la propriété downloadingPdf du contenu avec l'ID donné
      setContenuList((prevList) =>
         prevList.map((item) =>
            item.id === id
               ? { ...item, isPdfDownloading: !item.isPdfDownloading }
               : item
         )
      );
   };

   //all logics
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.listArticle, {
                  titleScreen: `${
                     langueActual === 'fr'
                        ? item.type_nom_fr + ' n° '
                        : item.type_nom_mg + ' faha '
                  } ${item.numero}`,
                  allArticleRelatedTotheContenu: filterArticleToListByContenu(
                     item.id,
                     allArticles
                  ),
                  idOfThisContenu: item.id,
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
                     {langueActual === 'fr'
                        ? item.type_nom_fr + ' n°'
                        : item.type_nom_mg + ' faha '}{' '}
                     {item.numero}
                  </Text>
                  <Text
                     style={{
                        fontSize:
                           Dimensions.get('window').height < 700 ? 10 : 12,
                        marginBottom: 8,
                        textTransform: 'lowercase',
                     }}
                  >
                     {langueActual === 'fr'
                        ? 'Publié le : '
                        : "Nivoaka tamin'ny : "}
                     {item.date?.substring(0, 10)}
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
                           downloadPdfFile(item, item.attachement?.slice(21));
                           handleToogleIsDownloading(item.id);
                        }}
                     >
                        <Icon
                           name={
                              item.isPdfDownloading
                                 ? 'hourglass-top'
                                 : 'file-download'
                           }
                           color={Colors.greenAvg}
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
               data={contenuList}
               extraData={contenuList}
               key={'_'}
               keyExtractor={_idKeyExtractor}
               renderItem={_renderItem}
               removeClippedSubviews={true}
               getItemLayout={(data, index) => ({
                  length: data.length,
                  offset: data.length * index,
                  index,
               })}
               contentContainerStyle={{ paddingBottom: 10 }}
            />
         </SafeAreaView>
      </View>
   );
}
