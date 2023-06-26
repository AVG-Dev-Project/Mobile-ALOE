import {
   View,
   Text,
   useWindowDimensions,
   ScrollView,
   TouchableOpacity,
   Pressable,
   Platform,
   ToastAndroid,
   Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, {
   useCallback,
   useEffect,
   useState,
   useMemo,
   useRef,
} from 'react';
import { styles } from './styles';
import Voice from '@react-native-voice/voice';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import {
   nameStackNavigation as nameNav,
   parsingTags,
   heightPercentageToDP,
} from '_utils';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Icon, Input } from '@rneui/themed';
import { Colors } from '_theme/Colors';
import {
   updateTagsChoice,
   hideShowTabBar,
   passValueForDeepSearch,
} from '_utils/redux/actions/action_creators';

//component custom
const LabelCustomBottomSheet = ({ text, filterBy, reference }) => {
   return (
      <TouchableOpacity
         onPress={() => {
            filterBy(text);
            reference.current.close();
         }}
         style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingVertical: 6,
         }}
      >
         <Icon name={'category'} color={Colors.black} size={18} />
         <Text
            style={{
               fontSize: Dimensions.get('window').width < 380 ? 16 : 22,
               marginLeft: 8,
            }}
         >
            {text?.length > 40 ? text?.substring(0, 30) + '...' : text}
         </Text>
      </TouchableOpacity>
   );
};

//filter global include search bar / filter by thematique and type
const filterGlobal = (langue, array, theme, type, query, tagChoice) => {
   let res = theme === null && type === null && query === null ? [] : array;

   if (type === 'tout' || theme === 'tout') {
      res = array;
   }
   if (theme && theme !== 'tout') {
      res =
         langue === 'fr'
            ? res.filter((_contenu) => _contenu.thematique_nom_fr === theme)
            : res.filter((_contenu) => _contenu.thematique_nom_mg === theme);
   }
   if (type && type !== 'tout') {
      res =
         langue === 'fr'
            ? res.filter((_contenu) => _contenu.type_nom_fr === type)
            : res.filter((_contenu) => _contenu.type_nom_mg === type);
   }
   if (query) {
      if (langue === 'fr') {
         res = res.filter(
            (_contenu) =>
               _contenu.objet_contenu_fr
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.numero?.includes(query) ||
               _contenu.date?.includes(query) ||
               _contenu.en_tete_contenu_fr
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.expose_des_motifs_contenu_fr
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.etat_nom_fr
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.note_contenu_fr
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.organisme_nom_fr
                  ?.toLowerCase()
                  .includes(query.toLowerCase())
         );
      }

      if (langue === 'mg') {
         res = res.filter(
            (_contenu) =>
               _contenu.objet_contenu_mg
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.numero?.includes(query) ||
               _contenu.date?.includes(query) ||
               _contenu.en_tete_contenu_mg
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.expose_des_motifs_contenu_mg
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.etat_nom_mg
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.note_contenu_mg
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
               _contenu.organisme_nom_mg
                  ?.toLowerCase()
                  .includes(query.toLowerCase())
         );
      }
   }
   if (tagChoice.length > 0) {
      if (langue === 'fr') {
         res = res.filter((_contenu) => {
            return parsingTags(_contenu.tag).some((tag) =>
               tagChoice.includes(tag.contenu_fr)
            );
         });
      }
      if (langue === 'mg') {
         res = res.filter((_contenu) => {
            return parsingTags(_contenu.tag).some((tag) =>
               tagChoice.includes(tag.contenu_mg)
            );
         });
      }
   }

   return res;
};

const filterGlobalForDeepSearch = (
   langue,
   arrayArticle,
   arrayContenu,
   theme,
   type,
   query,
   tagChoice
) => {
   let res =
      theme === null && type === null && query === null ? [] : arrayContenu;

   if (type === 'tout' || theme === 'tout') {
      res = arrayContenu;
   }
   if (theme && theme !== 'tout') {
      res =
         langue === 'fr'
            ? res.filter((_contenu) => _contenu.thematique_nom_fr === theme)
            : res.filter((_contenu) => _contenu.thematique_nom_mg === theme);
   }
   if (type && type !== 'tout') {
      res =
         langue === 'fr'
            ? res.filter((_contenu) => _contenu.type_nom_fr === type)
            : res.filter((_contenu) => _contenu.type_nom_mg === type);
   }
   if (query) {
      if (langue === 'fr') {
         let allIdOfContenuContainArticle = arrayArticle
            .filter(
               (_article) =>
                  _article.contenu_fr
                     ?.split('________________')[0]
                     .toLowerCase()
                     .includes(query.toLowerCase()) ||
                  _article.chapitre_titre_fr
                     ?.toLowerCase()
                     .includes(query.toLowerCase()) ||
                  _article.titre_fr?.toLowerCase().includes(query.toLowerCase())
            )
            .map((_article) => _article.contenu);

         res = res.filter((_contenu) =>
            allIdOfContenuContainArticle.includes(_contenu.id)
         );
      }

      if (langue === 'mg') {
         let allIdOfContenuContainArticle = arrayArticle
            .filter(
               (_article) =>
                  _article.contenu_mg
                     ?.split('________________')[0]
                     .toLowerCase()
                     .includes(query.toLowerCase()) ||
                  _article.chapitre_titre_mg
                     ?.toLowerCase()
                     .includes(query.toLowerCase()) ||
                  _article.titre_mg?.toLowerCase().includes(query.toLowerCase())
            )
            .map((_article) => _article.contenu);

         res = res.filter((_contenu) =>
            allIdOfContenuContainArticle.includes(_contenu.id)
         );
      }
   }
   if (tagChoice.length > 0) {
      if (langue === 'fr') {
         res = res.filter((_contenu) => {
            return parsingTags(_contenu.tag).some((tag) =>
               tagChoice.includes(tag.contenu_fr)
            );
         });
      }
      if (langue === 'mg') {
         res = res.filter((_contenu) => {
            return parsingTags(_contenu.tag).some((tag) =>
               tagChoice.includes(tag.contenu_mg)
            );
         });
      }
   }

   return res;
};

export default function Recherche({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const [valueForSearch, setValueForSearch] = useState('');
   const [textFromInputSearch, setTextFromValueForSearch] = useState('');
   const { width, height } = useWindowDimensions();
   const snapPoints = useMemo(
      () => (height < 700 ? [0, '70%'] : [0, '60%']),
      []
   );
   const allContenus = useSelector((selector) => selector.loi.contenus);
   const allArticles = useSelector((selector) => selector.loi.articles);
   const [allContenusFilter, setAllContenusFilter] = useState([]);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isUserNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const isUserConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const allTypes = useSelector((selector) => selector.loi.types);
   const allThematiques = useSelector((selector) => selector.loi.thematiques);
   const allTags = useSelector((selector) => selector.loi.tags);
   const urlApiAttachement = 'https://aloe.iteam-s.mg';
   const [chips, setChips] = useState(
      allTags.map((tag) => {
         return {
            label:
               langueActual === 'fr'
                  ? tag.contenu_fr
                  : tag.contenu_mg ?? tag.contenu_fr,
            choice: false,
         };
      })
   );

   const allTagsFromStore = useSelector((selector) => selector.loi.tagsChoice);
   //data from navigation
   let typeFromParams = route.params ? route.params.type : null;
   let thematiqueFromParams = route.params ? route.params.thematique : null;
   const [typeChecked, setTypeChecked] = useState(null);
   const [thematiqueChecked, setThematiqueChecked] = useState(null);
   let [startedSpeech, setStartedSpeech] = useState(false);
   const [isUseDeepSearch, setIsUseDeepSearch] = useState(false);
   const [offset, setOffset] = useState(0);

   //all refs
   const bottomSheetTypeRef = useRef(null);
   const bottomSheetThematiqueRef = useRef(null);

   //all effect
   useEffect(() => {
      if (typeFromParams || thematiqueFromParams) {
         setTypeChecked(typeFromParams);
         setThematiqueChecked(thematiqueFromParams);
      }
   }, [typeFromParams, thematiqueFromParams]);

   useEffect(() => {
      if (isUseDeepSearch) {
         dispatch(passValueForDeepSearch(valueForSearch));
         if (
            typeChecked ||
            thematiqueChecked ||
            valueForSearch ||
            allTagsFromStore.length > 0
         ) {
            setAllContenusFilter(
               filterGlobalForDeepSearch(
                  langueActual,
                  allArticles,
                  allContenus,
                  thematiqueChecked,
                  typeChecked,
                  valueForSearch,
                  allTagsFromStore
               )
            );
         } else {
            setAllContenusFilter([]);
         }
      }

      if (!isUseDeepSearch) {
         if (
            typeChecked ||
            thematiqueChecked ||
            valueForSearch ||
            allTagsFromStore.length > 0
         ) {
            setAllContenusFilter(
               filterGlobal(
                  langueActual,
                  allContenus,
                  thematiqueChecked,
                  typeChecked,
                  valueForSearch,
                  allTagsFromStore
               )
            );
         } else {
            setAllContenusFilter([]);
         }
      }
   }, [
      typeChecked,
      thematiqueChecked,
      valueForSearch,
      allTagsFromStore,
      isUseDeepSearch,
   ]);

   //necessary when we quit the page i.e rehefa miala amin'ilay page
   useFocusEffect(
      useCallback(() => {
         setValueForSearch('');
         setTextFromValueForSearch('');
         setIsUseDeepSearch(false);
         dispatch(passValueForDeepSearch(''));
         return () => {
            typeFromParams = null;
            thematiqueFromParams = null;
            setAllContenusFilter([]);
            setTypeChecked(null);
            setThematiqueChecked(null);
            dispatch(updateTagsChoice([]));
            dispatch(hideShowTabBar(false));
            setOffset(0);
         };
      }, [])
   );

   //necessary when we come back
   useFocusEffect(
      useCallback(() => {
         setChips(
            allTags.map((tag) => {
               return {
                  label:
                     langueActual === 'fr'
                        ? tag.contenu_fr
                        : tag.contenu_mg ?? tag.contenu_fr,
                  choice: false,
               };
            })
         );
      }, [allTags, langueActual])
   );

   useFocusEffect(
      useCallback(() => {
         setOffset(0);
         dispatch(hideShowTabBar(false));
      }, [])
   );

   //Effect pour declancher la translation
   useEffect(() => {
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;

      return () => {
         Voice.destroy().then(Voice.removeAllListeners);
      };
   }, []);

   //all function
   const scrollingFlashList = (e) => {
      const currentOffset = e.nativeEvent.contentOffset.y;

      if (offset > currentOffset) {
         dispatch(hideShowTabBar(false));
      } else {
         dispatch(hideShowTabBar(true));
      }
      setOffset(currentOffset);
   };

   const onHandleSearchByValue = (text) => {
      setValueForSearch(text);
   };

   const filterByType = (text) => {
      setTypeChecked(text);
   };

   const filterByThematique = (text) => {
      setThematiqueChecked(text);
   };
   const openBottomSheet = (ref) => {
      return ref.current?.present();
   };
   const downloadPdfFile = async (contenu, linkPdf) => {
      try {
         if (isUserNetworkActive && isUserConnectedToInternet) {
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
         }
      } catch (e) {
         ToastAndroid.show(
            'Erreur durant le télechargement du pdf',
            ToastAndroid.LONG
         );
      }
   };

   //add tags to store
   const handleAddChips = (chip) => {
      dispatch(updateTagsChoice(chip));
      setChips((prevList) =>
         prevList.map((item) =>
            item.label === chip ? { ...item, choice: !item.choice } : item
         )
      );
   };

   //fontcion utilie pour la translation du vocal en texte
   const startSpeechToText = async () => {
      await Voice.start('fr-FR');
      setStartedSpeech(true);
   };

   const stopSpeechToText = async () => {
      await Voice.stop();
      setStartedSpeech(false);
   };

   const onSpeechResults = (result) => {
      setValueForSearch(result.value[0]);
      setTextFromValueForSearch(result.value[0]);
      ToastAndroid.show(
         `Recherche de : ${result.value[0]} ....`,
         ToastAndroid.LONG
      );
   };

   const onSpeechError = (error) => {
      ToastAndroid.show(
         `Erreur !!! Veuillez bien prononcé votre mot en français.`,
         ToastAndroid.LONG
      );
   };

   //all render
   const _renderItem = useCallback(
      ({ item }) => {
         return (
            <TouchableOpacity
               activeOpacity={0.9}
               onPress={() => {
                  navigation.navigate(nameNav.listArticle, {
                     titleScreen: `${
                        langueActual === 'fr'
                           ? item.type_nom_fr + ' n° '
                           : `${item.type_nom_mg ?? item.type_nom_fr} faha}`
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
                        fontSize:
                           Dimensions.get('window').height < 700 ? 14 : 16,
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
                              Tags
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
                           <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                 ToastAndroid.show(
                                    langueActual === 'fr'
                                       ? 'Télechargement en cours...'
                                       : 'Andalam-pangalana ...',
                                    ToastAndroid.SHORT
                                 );
                                 downloadPdfFile(item, item.attachement);
                              }}
                           >
                              <Icon
                                 name={'file-download'}
                                 color={Colors.greenAvg}
                                 size={30}
                              />
                           </TouchableOpacity>
                        )}
                     </View>
                  </View>
               </View>
            </TouchableOpacity>
         );
      },
      [langueActual]
   );

   //tags
   const _renderItemChips = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleAddChips(item.label)}
         >
            <View
               style={[
                  styles.view_chips,
                  {
                     backgroundColor: item.choice
                        ? Colors.greenAvg
                        : Colors.background,
                  },
               ]}
            >
               <Text
                  numberOfLines={1}
                  style={[
                     styles.item_chip,
                     {
                        color: item.choice ? Colors.white : Colors.black,
                     },
                  ]}
               >
                  {item.label}
               </Text>
            </View>
         </TouchableOpacity>
      );
   }, []);

   const renderBackDrop = useCallback(
      (props) => <BottomSheetBackdrop {...props} opacity={0.6} />,
      []
   );

   const _idKeyExtractor = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   const _idKeyExtractorChip = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   return (
      <View style={styles.view_container_search}>
         <View style={styles.head_content}>
            <View
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
               }}
            >
               <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                  {t('recherche.title_page')}
               </Text>
            </View>

            <View style={styles.view_for_input_search}>
               <Input
                  placeholder={t('recherche.placeholder_input_search')}
                  value={textFromInputSearch}
                  onChangeText={(text) => {
                     onHandleSearchByValue(text);
                     setTextFromValueForSearch(text);
                  }}
                  errorMessage={
                     isUseDeepSearch
                        ? t('recherche.text_for_deep_search_in_use')
                        : t('recherche.text_for_deep_search_off')
                  }
                  errorStyle={{ color: Colors.greenAvg }}
                  leftIcon={
                     isUseDeepSearch ? (
                        <Icon
                           name={'radio-button-checked'}
                           color={Colors.greenAvg}
                           size={26}
                           onPress={() => {
                              setIsUseDeepSearch(false);
                           }}
                        />
                     ) : (
                        <Icon
                           name={'radio-button-unchecked'}
                           color={Colors.greenAvg}
                           size={26}
                           onPress={() => {
                              setIsUseDeepSearch(true);
                           }}
                        />
                     )
                  }
                  rightIcon={
                     !startedSpeech ? (
                        <Icon
                           name={'mic'}
                           color={Colors.greenAvg}
                           size={30}
                           onPress={() => {
                              if (
                                 isUserNetworkActive &&
                                 isUserConnectedToInternet
                              ) {
                                 setStartedSpeech(true);
                                 startSpeechToText();
                              } else {
                                 ToastAndroid.show(
                                    `La recherche a besoin d'une connexion internet stable !!!`,
                                    ToastAndroid.LONG
                                 );
                              }
                           }}
                        />
                     ) : (
                        <Icon
                           name={'more-horiz'}
                           color={Colors.greenAvg}
                           size={30}
                           onPress={() => {
                              setStartedSpeech(false);
                              stopSpeechToText();
                           }}
                        />
                     )
                  }
               />
            </View>

            <View style={styles.view_for_filtre}>
               <View style={styles.view_in_filtre}>
                  <View>
                     <Text
                        style={{
                           textAlign: 'center',
                           fontWeight: 'bold',
                           fontSize: 18,
                           marginTop: 10,
                        }}
                     >
                        {t('recherche.type_title')}
                     </Text>
                     <Text>
                        {typeChecked ? typeChecked?.substring(0, 15) : ''}
                     </Text>
                  </View>
                  <TouchableOpacity
                     activeOpacity={0.8}
                     onPress={() => openBottomSheet(bottomSheetTypeRef)}
                  >
                     <Icon
                        name={'filter-list'}
                        color={Colors.greenAvg}
                        size={34}
                     />
                  </TouchableOpacity>
               </View>
               <View style={styles.view_in_filtre}>
                  <TouchableOpacity
                     activeOpacity={0.8}
                     onPress={() => openBottomSheet(bottomSheetThematiqueRef)}
                  >
                     <Icon
                        name={'filter-list'}
                        color={Colors.greenAvg}
                        size={34}
                     />
                  </TouchableOpacity>
                  <View>
                     <Text
                        style={{
                           textAlign: 'center',
                           fontWeight: 'bold',
                           fontSize: 18,
                           marginTop: 10,
                        }}
                     >
                        {t('recherche.thematique_title')}
                     </Text>
                     <Text>
                        {thematiqueChecked
                           ? thematiqueChecked?.length > 10
                              ? thematiqueChecked?.substring(0, 10) + '...'
                              : thematiqueChecked
                           : ''}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
         <View style={styles.view_carousel}>
            <Text style={styles.labelTags}>{t('recherche.tag_title')} : </Text>
            <FlashList
               data={chips}
               horizontal={true}
               extraData={chips}
               key={'_'}
               keyExtractor={_idKeyExtractorChip}
               showsHorizontalScrollIndicator={false}
               estimatedItemSize={80}
               renderItem={_renderItemChips}
               getItemLayout={(data, index) => ({
                  length: data.length,
                  offset: data.length * index,
                  index,
               })}
            />
         </View>
         <View style={styles.view_for_result}>
            {allContenusFilter?.length > 0 && (
               <Text style={{ textAlign: 'center' }}>
                  {t('recherche.number_of_result_found', { allContenusFilter })}
               </Text>
            )}
         </View>
         <View style={styles.view_flatlist}>
            <FlashList
               data={allContenusFilter}
               ListEmptyComponent={
                  <View
                     style={{
                        display: 'flex',
                        borderWidth: 1,
                        borderColor: Colors.redError,
                        borderRadius: 8,
                        padding: width < 370 ? 8 : 12,
                        marginVertical: width < 370 ? 8 : 12,
                     }}
                  >
                     <Text
                        style={{
                           textAlign: 'center',
                           color: Colors.redError,
                           fontSize: width < 370 ? 16 : 22,
                        }}
                     >
                        {t('recherche.no_result')}
                     </Text>
                  </View>
               }
               key={'_'}
               keyExtractor={_idKeyExtractor}
               onScroll={scrollingFlashList}
               estimatedItemSize={100}
               renderItem={_renderItem}
               getItemLayout={(data, index) => ({
                  length: data.length,
                  offset: data.length * index,
                  index,
               })}
               maxToRenderPerBatch={3}
            />
         </View>

         <BottomSheetModal
            ref={bottomSheetTypeRef}
            backdropComponent={renderBackDrop}
            index={1}
            snapPoints={snapPoints}
            style={styles.view_bottom_sheet}
         >
            <ScrollView style={styles.view_in_bottomsheet}>
               <View>
                  {allTypes.map((type) => (
                     <LabelCustomBottomSheet
                        reference={bottomSheetTypeRef}
                        filterBy={filterByType}
                        key={type.id}
                        text={
                           langueActual === 'fr'
                              ? type.nom_fr
                              : type.nom_mg ?? type.nom_fr
                        }
                     />
                  ))}
                  <TouchableOpacity
                     onPress={() => {
                        filterByType('tout');
                        bottomSheetTypeRef.current.close();
                     }}
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingVertical: 6,
                     }}
                  >
                     <Icon name={'category'} color={Colors.black} size={18} />
                     <Text
                        style={{
                           fontSize:
                              Dimensions.get('window').width < 380 ? 16 : 22,
                           marginLeft: 8,
                        }}
                     >
                        Afficher tout
                     </Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>
         </BottomSheetModal>

         <BottomSheetModal
            ref={bottomSheetThematiqueRef}
            backdropComponent={renderBackDrop}
            index={1}
            snapPoints={snapPoints}
            style={styles.view_bottom_sheet}
         >
            <ScrollView style={styles.view_in_bottomsheet}>
               <View>
                  {allThematiques.map((thematique) => (
                     <LabelCustomBottomSheet
                        reference={bottomSheetThematiqueRef}
                        filterBy={filterByThematique}
                        key={thematique.id}
                        text={
                           langueActual === 'fr'
                              ? thematique.nom_fr
                              : thematique.nom_mg ?? thematique.nom_fr
                        }
                     />
                  ))}
                  <TouchableOpacity
                     onPress={() => {
                        filterByThematique('tout');
                        bottomSheetThematiqueRef.current.close();
                     }}
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingVertical: 6,
                     }}
                  >
                     <Icon name={'category'} color={Colors.black} size={18} />
                     <Text
                        style={{
                           fontSize:
                              Dimensions.get('window').width < 380 ? 16 : 22,
                           marginLeft: 8,
                        }}
                     >
                        Afficher tout
                     </Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>
         </BottomSheetModal>
      </View>
   );
}
