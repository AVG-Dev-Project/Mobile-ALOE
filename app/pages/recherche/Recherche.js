import {
   View,
   Text,
   FlatList,
   SafeAreaView,
   useWindowDimensions,
   TextInput,
   ScrollView,
   TouchableOpacity,
   ToastAndroid,
   Dimensions,
   Button,
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
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { nameStackNavigation as nameNav, parsingTags } from '_utils';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Lottie from 'lottie-react-native';
import { Icon } from '@rneui/themed';
import { Colors } from '_theme/Colors';
import { updateTagsChoice } from '_utils/redux/actions/action_creators';

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
const filterGlobal = (array, theme, type, query, tagChoice) => {
   let res = theme === null && type === null && query === null ? [] : array;

   if (type === 'tout' || theme === 'tout') {
      res = array;
   }
   if (theme && theme !== 'tout') {
      res = res.filter((_contenu) => _contenu.thematique_nom_fr === theme);
   }
   if (type && type !== 'tout') {
      res = res.filter((_contenu) => _contenu.type_nom_fr === type);
   }
   if (query) {
      res = res.filter((_contenu) =>
         _contenu.objet_contenu_fr.toLowerCase().includes(query.toLowerCase())
      );
   }
   if (tagChoice.length > 0) {
      res = res.filter((_contenu) => {
         return parsingTags(_contenu.tag).some((tag) =>
            tagChoice.includes(tag.contenu_fr)
         );
      });
   }

   return res;
};

export default function Recherche({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const animation = useRef(null);
   const [valueForSearch, setValueForSearch] = useState('');
   const [textFromInputSearch, setTextFromValueForSearch] = useState('');
   const { width, height } = useWindowDimensions();
   const snapPoints = useMemo(
      () => (height < 700 ? [0, '70%'] : [0, '60%']),
      []
   );
   const allContenus = useSelector((selector) => selector.loi.contenus);
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
   const urlApiAttachement = 'https://avg.e-commerce-mg.com';
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
   console.log('height ', height);
   //data from navigation
   let typeFromParams = route.params ? route.params.type : null;
   let thematiqueFromParams = route.params ? route.params.thematique : null;
   const [typeChecked, setTypeChecked] = useState(null);
   const [thematiqueChecked, setThematiqueChecked] = useState(null);
   let [startedSpeech, setStartedSpeech] = useState(false);

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
      if (
         typeChecked ||
         thematiqueChecked ||
         valueForSearch ||
         allTagsFromStore.length > 0
      ) {
         setAllContenusFilter(
            filterGlobal(
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
   }, [typeChecked, thematiqueChecked, valueForSearch, allTagsFromStore]);

   //necessary when we quit the page i.e rehefa miala amin'ilay page
   useFocusEffect(
      useCallback(() => {
         return () => {
            typeFromParams = null;
            thematiqueFromParams = null;
            setAllContenusFilter([]);
            setTypeChecked(null);
            setThematiqueChecked(null);
            setValueForSearch('');
            setTextFromValueForSearch('');
            dispatch(updateTagsChoice([]));
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

   //Effect pour declancher la translation
   useEffect(() => {
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;

      return () => {
         Voice.destroy().then(Voice.removeAllListeners);
      };
   }, []);

   //all function
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
                              ToastAndroid.show(
                                 langueActual === 'fr'
                                    ? 'Télechargement en cours...'
                                    : 'Andalam-pangalana ...',
                                 ToastAndroid.SHORT
                              );
                              downloadPdfFile(
                                 item,
                                 item.attachement?.slice(21)
                              );
                           }}
                        >
                           <Icon
                              name={'file-download'}
                              color={Colors.greenAvg}
                              size={30}
                           />
                        </TouchableOpacity>
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
         <View>
            <View style={styles.head_content}>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                  }}
               >
                  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                     Recherche
                  </Text>
               </View>

               <View style={styles.view_for_input_search}>
                  <TextInput
                     style={styles.input}
                     keyboardType="default"
                     placeholder={
                        langueActual === 'fr'
                           ? 'Entrer le mot de recherche ...'
                           : 'Ampidiro ny teny hotadiavina...'
                     }
                     value={textFromInputSearch}
                     onChangeText={(text) => {
                        onHandleSearchByValue(text);
                        setTextFromValueForSearch(text);
                     }}
                  />
                  {!startedSpeech ? (
                     <TouchableOpacity
                        activeOpacity={0.7}
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
                     >
                        <Text style={styles.boutton_search}>
                           <Icon
                              name={'mic'}
                              color={Colors.greenAvg}
                              size={30}
                           />
                        </Text>
                     </TouchableOpacity>
                  ) : undefined}
                  {startedSpeech ? (
                     <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                           setStartedSpeech(false);
                           stopSpeechToText();
                        }}
                     >
                        <Lottie
                           autoPlay
                           ref={animation}
                           style={styles.boutton_search_on}
                           source={require('_images/vocal_on.json')}
                        />
                     </TouchableOpacity>
                  ) : undefined}
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
                           {langueActual === 'fr' ? 'Type' : 'Karazana'}
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
                        onPress={() =>
                           openBottomSheet(bottomSheetThematiqueRef)
                        }
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
                           {langueActual === 'fr' ? 'Théme' : 'Lohahevitra'}
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
               <Text style={styles.labelTags}>Tags : </Text>
               <FlatList
                  data={chips}
                  horizontal={true}
                  extraData={chips}
                  key={'_'}
                  keyExtractor={_idKeyExtractorChip}
                  showsHorizontalScrollIndicator={false}
                  renderItem={_renderItemChips}
                  removeClippedSubviews={true}
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
                     {allContenusFilter?.length}{' '}
                     {langueActual === 'fr'
                        ? ' résultats trouvés'
                        : ' ny valiny hita'}
                  </Text>
               )}
            </View>
         </View>
         <SafeAreaView>
            <FlatList
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
                        {langueActual === 'fr'
                           ? 'pas de résultat'
                           : '0 ny valiny'}
                     </Text>
                  </View>
               }
               key={'_'}
               keyExtractor={_idKeyExtractor}
               renderItem={_renderItem}
               removeClippedSubviews={true}
               getItemLayout={(data, index) => ({
                  length: data.length,
                  offset: data.length * index,
                  index,
               })}
               maxToRenderPerBatch={3}
            />
         </SafeAreaView>

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
                        text={langueActual === 'fr' ? type.nom_fr : type.nom_mg}
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
                              : thematique.nom_mg
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
