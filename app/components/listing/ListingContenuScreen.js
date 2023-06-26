import {
   View,
   Text,
   ToastAndroid,
   TouchableOpacity,
   ActivityIndicator,
   Platform,
   Pressable,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { FlashList } from '@shopify/flash-list';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {
   nameStackNavigation as nameNav,
   fetchContenusToApi,
   parseDataContenuLazyLoading,
   parsingTags,
   heightPercentageToDP,
} from '_utils';
import { styles } from './stylesContenu';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import { getAllContenus } from '_utils/redux/actions/action_creators';
import { useTranslation } from 'react-i18next';

export default function ListingContenu({ navigation }) {
   //all data
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const isNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const allContenusFromStore = useSelector(
      (selector) => selector.loi.contenus
   );
   const urlApiAttachement = 'https://aloe.iteam-s.mg';
   const [isGetNextData, setIsGetNextData] = useState(false);
   const [contenuList, setContenuList] = useState(
      allContenusFromStore.map((item) => {
         return {
            ...item,
            isPdfDownloading: false,
         };
      })
   );
   const [totalPage, setTotalPage] = useState(1);
   const [currentPage, setCurrentPage] = useState(0);

   //all functions
   const downloadPdfFile = async (contenu, linkPdf) => {
      try {
         if (isNetworkActive && isConnectedToInternet) {
            if (Platform.Version >= 29) {
               ReactNativeBlobUtil.config({
                  fileCache: true,
               })
                  .fetch('GET', urlApiAttachement + linkPdf)
                  .then(async (resp) => {
                     await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
                        {
                           name:
                              langueActual === 'fr'
                                 ? `${contenu.type_nom_fr} n° ${contenu.numero}`
                                 : `${
                                      contenu.type_nom_mg ?? contenu.type_nom_fr
                                   } faha ${contenu.numero}`,
                           parentFolder: 'aloe/pdf',
                           mimeType: 'application/pdf',
                        },
                        'Download',
                        resp.path()
                     );
                     handleToogleIsDownloading(contenu.id);
                     ToastAndroid.show(
                        `${
                           langueActual === 'fr'
                              ? contenu.type_nom_fr
                              : contenu.type_nom_mg
                        } n° ${
                           contenu.numero
                        } télecharger dans download/aloe/pdf.`,
                        ToastAndroid.SHORT
                     );
                  });
            }
            if (Platform.Version < 29) {
               const downloadResumable = FileSystem.createDownloadResumable(
                  urlApiAttachement + linkPdf,
                  FileSystem.documentDirectory + linkPdf?.slice(19)
               );

               const { uri } = await downloadResumable.downloadAsync();
               const asset = await MediaLibrary.createAssetAsync(uri);
               const album = await MediaLibrary.getAlbumAsync('Download');
               if (album === null) {
                  await MediaLibrary.createAlbumAsync('Download', asset, false);
               } else {
                  await MediaLibrary.addAssetsToAlbumAsync(
                     [asset],
                     album,
                     false
                  );
                  ToastAndroid.show(
                     `${
                        langueActual === 'fr'
                           ? contenu.type_nom_fr
                           : contenu.type_nom_mg
                     } n° ${
                        contenu.numero
                     } télecharger dans le dossier download!`,
                     ToastAndroid.SHORT
                  );
                  handleToogleIsDownloading(contenu.id);
               }
            }
         } else {
            ToastAndroid.show(
               `${
                  langueActual === 'fr'
                     ? "La télechargement de cette contenu a besoin d'une connexion internet stable!"
                     : 'Mila interneto mandeha tsara raha te haka io votoantin-dala io!'
               }`,
               ToastAndroid.SHORT
            );
            handleToogleIsDownloading(contenu.id);
         }
      } catch (e) {
         ToastAndroid.show(
            'Erreur durant le télechargement du pdf',
            ToastAndroid.LONG
         );
         handleToogleIsDownloading(contenu.id);
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

   const getNextPageContenusFromApi = async () => {
      if (isGetNextData) {
         return;
      }
      setIsGetNextData(true);

      try {
         let res = await fetchContenusToApi(currentPage + 1);
         if (res.results?.length > 0) {
            setCurrentPage(currentPage + 1);
            setTotalPage(res.pages_count);
            let oldAllContenus = [...contenuList];
            res.results.map((result) => {
               if (
                  !oldAllContenus.find((contenu) => contenu.id === result.id)
               ) {
                  oldAllContenus.push(parseDataContenuLazyLoading(result));
               }
            });
            dispatch(getAllContenus(oldAllContenus));
            setContenuList(oldAllContenus);
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
            await getNextPageContenusFromApi();
         }
      } else {
         ToastAndroid.show(
            `Pas de connexion, impossible d'obtenir des datas suppl!`,
            ToastAndroid.SHORT
         );
         return;
      }
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
                        : `${item.type_nom_mg ?? item.type_nom_fr} faha`
                  } ${item.numero}`,
                  contenuMother: item,
               });
            }}
         >
            <View style={styles.view_render}>
               <View>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                     }}
                  >
                     <Text
                        style={{
                           fontWeight: 'bold',
                           fontSize: 18,
                        }}
                     >
                        {langueActual === 'fr'
                           ? item.type_nom_fr + ' n°'
                           : `${
                                item.type_nom_mg ?? item.type_nom_fr
                             } faha`}{' '}
                        {item.numero}
                     </Text>
                  </View>
                  <Text
                     style={{
                        fontSize: heightPercentageToDP(1.5),
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
                     fontSize: heightPercentageToDP(2),
                     flex: 2,
                     marginBottom: 18,
                  }}
                  numberOfLines={3}
               >
                  {langueActual === 'fr'
                     ? item.objet_contenu_fr
                     : item.objet_contenu_mg ?? item.objet_contenu_fr}{' '}
               </Text>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'column',
                  }}
               >
                  <Text style={{ textDecorationLine: 'underline' }}>
                     {t('listing.theme_and_type')}
                  </Text>
                  <Text
                     style={{
                        fontSize: 14,
                     }}
                     numberOfLines={2}
                  >
                     *{' '}
                     {langueActual === 'fr'
                        ? item.thematique_nom_fr
                        : item.thematique_nom_mg ?? item.thematique_nom_fr}
                  </Text>
                  <Text
                     style={{
                        fontSize: 14,
                     }}
                     numberOfLines={2}
                  >
                     *{' '}
                     {langueActual === 'fr'
                        ? item.type_nom_fr
                        : item.type_nom_mg ?? item.type_nom_fr}
                  </Text>

                  {parsingTags(item.tag).length > 0 && (
                     <View>
                        <Text style={{ textDecorationLine: 'underline' }}>
                           {t('listing.categorie')}
                        </Text>
                        <Text numberOfLines={2}>
                           *{' '}
                           {parsingTags(item.tag).map((tag) =>
                              langueActual === 'fr'
                                 ? tag.contenu_fr + ', '
                                 : `${tag.contenu_mg ?? tag.contenu_fr},}`
                           )}
                        </Text>
                     </View>
                  )}
               </View>
               <View>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                     }}
                  >
                     {item.attachement !== null && (
                        <Pressable
                           activeOpacity={0.8}
                           onPress={() => {
                              downloadPdfFile(item, item.attachement);
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
                              size={30}
                           />
                        </Pressable>
                     )}
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
         <FlashList
            data={contenuList}
            extraData={contenuList}
            key={'_'}
            keyExtractor={_idKeyExtractor}
            removeClippedSubviews={true}
            nestedScrollEnabled={true}
            renderItem={_renderItem}
            getItemLayout={(data, index) => ({
               length: data.length,
               offset: data.length * index,
               index,
            })}
            onEndReachedThreshold={0.5}
            estimatedItemSize={100}
            onEndReached={() => {
               if (!isGetNextData && currentPage < totalPage) {
                  handleLoadMore();
               }
            }}
            ListFooterComponent={
               isGetNextData && (
                  <View style={styles.activity_indicator}>
                     <ActivityIndicator size="large" color={Colors.greenAvg} />
                  </View>
               )
            }
         />
      </View>
   );
}
