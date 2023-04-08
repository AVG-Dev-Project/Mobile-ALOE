import {
   View,
   Text,
   FlatList,
   SafeAreaView,
   useWindowDimensions,
   TextInput,
   ActivityIndicator,
   TouchableOpacity,
   ToastAndroid,
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
import {
   nameStackNavigation as nameNav,
   filterArticleToListByContenu,
} from '_utils';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Lottie from 'lottie-react-native';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Colors } from '_theme/Colors';
import Voice from '@react-native-voice/voice';

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
            paddingVertical: 12,
         }}
      >
         <Icon name={'category'} color={Colors.black} size={18} />
         <Text style={{ fontSize: 22, marginLeft: 8 }}>
            {text.length > 20 ? text?.substring(0, 30) + '...' : text}
         </Text>
      </TouchableOpacity>
   );
};

//filter global include search bar / filter by thematique and type
const filterGlobal = (array, theme, type, query) => {
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
      res = res.filter((_loi) =>
         _loi.objet_contenu_fr.toLowerCase().includes(query.toLowerCase())
      );
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
      () => (height < 700 ? [-1, '70%'] : [-1, '60%']),
      []
   );
   const allArticles = useSelector((selector) => selector.loi.articles);
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
   const urlApiAttachement = 'https://avg.e-commerce-mg.com';

   //data from navigation
   let typeFromParams = route.params ? route.params.type : null;
   let thematiqueFromParams = route.params ? route.params.thematique : null;
   const [typeChecked, setTypeChecked] = useState(null);
   const [thematiqueChecked, setThematiqueChecked] = useState(null);
   const [isSearch, setIsSearch] = useState(false);
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
      if (typeChecked || thematiqueChecked || valueForSearch) {
         setAllContenusFilter(
            filterGlobal(
               allContenus,
               thematiqueChecked,
               typeChecked,
               valueForSearch
            )
         );
      } else {
         setAllContenusFilter([]);
      }
   }, [typeChecked, thematiqueChecked, valueForSearch]);

   //necessary when we come back from home page i.e rehefa unmount page
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
         };
      }, [])
   );

   //pour le bottom sheet
   useEffect(() => {
      bottomSheetTypeRef.current.close();
      bottomSheetThematiqueRef.current.close();
   }, []);

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
      setIsSearch(false);
   };

   const filterByType = (text) => {
      setTypeChecked(text);
   };

   const filterByThematique = (text) => {
      setThematiqueChecked(text);
   };
   const openBottomSheet = (ref) => {
      return ref.current.snapTo(1);
   };

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
         }
      } catch (e) {
         ToastAndroid.show(
            'Erreur durant le télechargement du pdf',
            ToastAndroid.LONG
         );
         console.log(e);
      }
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
         `Recherche de : ${result.value[0]} .........`,
         ToastAndroid.LONG
      );
   };

   const onSpeechError = (error) => {
      console.log(error);
      ToastAndroid.show(
         `Erreur !!! Veuillez bien prononcé votre mot en français.`,
         ToastAndroid.LONG
      );
   };

   //all render
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.listArticle, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Loi n°' : 'Lalana faha '
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
                        fontSize: width < 370 ? 15 : 18,
                     }}
                  >
                     {langueActual === 'fr' ? 'Loi n°' : 'Lalana faha '}{' '}
                     {item.numero}
                  </Text>
                  <Text
                     style={{
                        fontSize: width < 370 ? 9 : 12,
                        marginBottom: 8,
                        textDecorationLine: 'underline',
                     }}
                  >
                     {langueActual === 'fr'
                        ? item.organisme_nom_fr
                        : item.organisme_nom_mg}
                  </Text>
               </View>
               <Text
                  style={{
                     fontSize: width < 370 ? 12 : 16,
                     flex: 2,
                     textTransform: 'capitalize',
                  }}
                  numberOfLines={width < 370 ? 2 : 3}
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
                           ? item.thematique_nom_fr.length > 20
                              ? item.thematique_nom_fr?.substring(0, 20) + '...'
                              : item.thematique_nom_fr
                           : item.thematique_nom_mg.length > 20
                           ? item.thematique_nom_mg?.substring(0, 20) + '...'
                           : item.thematique_nom_mg}{' '}
                        {' / '}
                        {langueActual === 'fr'
                           ? item.type_nom_fr.length > 20
                              ? item.type_nom_fr?.substring(0, 20) + '...'
                              : item.type_nom_fr
                           : item.type_nom_mg.length > 20
                           ? item.type_nom_mg?.substring(0, 20) + '...'
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
                        }}
                     >
                        <Icon
                           name={'file-download'}
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

   const renderBackDrop = useCallback(
      (props) => <BottomSheetBackdrop {...props} opacity={0.6} />,
      []
   );

   const activityIndicator = () => {
      if (isSearch) {
         return (
            <View style={{ display: 'flex', flex: 1 }}>
               <ActivityIndicator size="large" />
            </View>
         );
      }
   };

   const _idKeyExtractor = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   return (
      <View style={styles.view_container_search}>
         <SafeAreaView>
            <FlatList
               data={allContenusFilter}
               ListHeaderComponent={
                  <View>
                     <View style={styles.head_content}>
                        <View
                           style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                           }}
                        >
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
                                 <Icon
                                    name={'mic'}
                                    color={Colors.greenAvg}
                                    size={30}
                                 />
                                 <Text style={{ fontWeight: 'bold' }}>
                                    {langueActual === 'fr'
                                       ? 'Recherche vocale'
                                       : "Hitady amin'ny alalan'ny feo"}{' '}
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
                                    style={styles.vocal_off}
                                    source={require('_images/vocal_on.json')}
                                 />
                              </TouchableOpacity>
                           ) : undefined}
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
                           <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                 {
                                    setIsSearch(true);
                                    onHandleSearchByValue(textFromInputSearch);
                                 }
                              }}
                           >
                              <Text style={styles.boutton_search}>
                                 <Icon
                                    name={'search'}
                                    color={Colors.black}
                                    size={40}
                                 />
                              </Text>
                           </TouchableOpacity>
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
                                    {langueActual === 'fr'
                                       ? 'Thématique'
                                       : 'Lohahevitra'}
                                 </Text>
                                 {thematiqueChecked !== null && (
                                    <Text>
                                       {thematiqueChecked?.substring(0, 15)}
                                    </Text>
                                 )}
                              </View>
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
                           </View>

                           <View style={styles.view_in_filtre}>
                              <TouchableOpacity
                                 activeOpacity={0.8}
                                 onPress={() =>
                                    openBottomSheet(bottomSheetTypeRef)
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
                                    {langueActual === 'fr'
                                       ? 'Type'
                                       : 'Karazana'}
                                 </Text>
                                 {typeChecked !== null && (
                                    <Text>{typeChecked?.substring(0, 15)}</Text>
                                 )}
                              </View>
                           </View>
                        </View>
                     </View>
                     <View style={styles.view_for_result}>
                        {allContenusFilter?.length > 0 && (
                           <Text style={{ textAlign: 'center' }}>
                              {allContenusFilter.length}{' '}
                              {langueActual === 'fr'
                                 ? ' résultats trouvés'
                                 : ' ny valiny hita'}
                           </Text>
                        )}
                     </View>
                  </View>
               }
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
               onEndReachedThreshold={1}
               onEndReached={() => {
                  console.log('on end reached');
               }}
            />
            {activityIndicator()}
         </SafeAreaView>

         <BottomSheet
            ref={bottomSheetTypeRef}
            backdropComponent={renderBackDrop}
            index={1}
            snapPoints={snapPoints}
            style={styles.view_bottom_sheet}
         >
            <View style={styles.view_in_bottomsheet}>
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
                     paddingVertical: 12,
                  }}
               >
                  <Icon name={'category'} color={Colors.black} size={18} />
                  <Text style={{ fontSize: 22, marginLeft: 8 }}>
                     Afficher tout
                  </Text>
               </TouchableOpacity>
            </View>
         </BottomSheet>

         <BottomSheet
            ref={bottomSheetThematiqueRef}
            backdropComponent={renderBackDrop}
            index={1}
            snapPoints={snapPoints}
            style={styles.view_bottom_sheet}
         >
            <View style={styles.view_in_bottomsheet}>
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
                     paddingVertical: 12,
                  }}
               >
                  <Icon name={'category'} color={Colors.black} size={18} />
                  <Text style={{ fontSize: 22, marginLeft: 8 }}>
                     Afficher tout
                  </Text>
               </TouchableOpacity>
            </View>
         </BottomSheet>
      </View>
   );
}
