import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   Dimensions,
   SafeAreaView,
   ToastAndroid,
   ActivityIndicator,
   useWindowDimensions,
   TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
   nameStackNavigation as nameNav,
   fetchContenusToApi,
   parseDataContenuLazyLoading,
   parsingTags,
} from '_utils';
import { styles } from './stylesContenu';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import {
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllContenus,
   getCurrentPageContenuForApi,
   getCurrentPageArticleForApi,
   getTotalPageApi,
} from '_utils/redux/actions/action_creators';

export default function ListingContenu({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const isNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   let { width } = useWindowDimensions();
   const allContenusFromStore = useSelector(
      (selector) => selector.loi.contenus
   );
   const urlApiAttachement = 'https://avg.e-commerce-mg.com';
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
         } else {
            ToastAndroid.show(
               `${
                  langueActual === 'fr'
                     ? "La télechargement de cette contenu a besoin d'une connexion internet stable!"
                     : 'Mila interneto mandeha tsara raha te haka io votoantin-dala io!'
               }`,
               ToastAndroid.SHORT
            );
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
      let res = await fetchContenusToApi(currentPage + 1);
      setCurrentPage(currentPage + 1);
      setTotalPage(res.pages_count);
      let oldAllContenus = [...contenuList];
      res.results.map((result) => {
         if (!oldAllContenus.find((contenu) => contenu.id === result.id)) {
            oldAllContenus.push(parseDataContenuLazyLoading(result));
         }
      });
      dispatch(getAllContenus(oldAllContenus));
      setContenuList(oldAllContenus);
      setIsGetNextData(false);
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
                        : item.type_nom_mg ?? 'Votoantiny' + ' faha '}{' '}
                     {item.numero}
                  </Text>
                  <Text
                     style={{
                        fontSize:
                           Dimensions.get('window').height < 700 ? 10 : 12,
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
                     Thématique et Type
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
                           Tags
                        </Text>
                        <Text numberOfLines={2}>
                           *{' '}
                           {parsingTags(item.tag).map((tag) =>
                              langueActual === 'fr'
                                 ? tag.contenu_fr + ', '
                                 : tag.contenu_mg ??
                                   ', ' + tag.contenu_fr + ', '
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
                           size={30}
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
               onEndReachedThreshold={0.5}
               onEndReached={async () => {
                  if (isConnectedToInternet && isNetworkActive) {
                     if (currentPage < totalPage) {
                        setIsGetNextData(true);
                        await getNextPageContenusFromApi();
                     }
                  } else {
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
