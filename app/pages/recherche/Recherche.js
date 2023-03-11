import {
   View,
   Text,
   FlatList,
   SafeAreaView,
   useWindowDimensions,
   TextInput,
   TouchableOpacity,
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
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import {
   nameStackNavigation as nameNav,
   filterArticleToListByContenu,
} from '_utils';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';
import { Colors } from '_theme/Colors';
import { LoiService } from '_utils';

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
            {text?.substring(0, 16)}
         </Text>
      </TouchableOpacity>
   );
};

//filter global include search bar / filter by thematique and type
const filterGlobal = (array, theme, type, query) => {
   let res = theme === null && type === null && query === null ? [] : array;

   if (theme) {
      res = res.filter((_contenu) => _contenu.thematique_nom_fr === theme);
   }
   if (type) {
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
   const [valueForSearch, setValueForSearch] = useState('');
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
   const allTypes = useSelector((selector) => selector.loi.types);
   const allThematiques = useSelector((selector) => selector.loi.thematiques);
   //state record
   const [recording, setRecording] = useState(null);
   const [isFetching, setIsFetching] = useState(false);
   const [isRecording, setIsRecording] = useState(false);
   const [query, setQuery] = useState('');

   //data from navigation
   let typeFromParams = route.params ? route.params.type : null;
   let thematiqueFromParams = route.params ? route.params.thematique : null;
   const [typeChecked, setTypeChecked] = useState(null);
   const [thematiqueChecked, setThematiqueChecked] = useState(null);

   //config record
   const recordingOptions = {
      // android not currently in use. Not getting results from speech to text with .m4a
      // but parameters are required
      android: {
         extension: '.m4a',
         outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
         audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
         sampleRate: 44100,
         numberOfChannels: 2,
         bitRate: 128000,
      },
      ios: {
         extension: '.wav',
         audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
         sampleRate: 44100,
         numberOfChannels: 1,
         bitRate: 128000,
         linearPCMBitDepth: 16,
         linearPCMIsBigEndian: false,
         linearPCMIsFloat: false,
      },
   };

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
         };
      }, [])
   );

   useEffect(() => {
      bottomSheetTypeRef.current.close();
      bottomSheetThematiqueRef.current.close();
   }, []);

   //all function
   /*const findObjectContainValueSearch = (word) => {
      if (word !== '') {
         if (langueActual === 'fr') {
            let resultSearch = allArticles.filter(
               (item) =>
                  item.Titre.titre_fr
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Article.contenu_Article_fr
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Intutile.contenu_intutile
                     .toLowerCase()
                     .includes(word.toLowerCase())
            );
            setAllContenusFilter(resultSearch);
         } else {
            let resultSearch = allArticles.filter(
               (item) =>
                  item.Titre.titre_mg
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Article.contenu_Article_mg
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Intutile.contenu_intutile
                     .toLowerCase()
                     .includes(word.toLowerCase())
            );
            setAllContenusFilter(resultSearch);
         }
      } else {
         setAllContenusFilter([]);
      }
   };*/

   const onHandleChangeValueSearch = (text) => {
      setValueForSearch(text);
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

   //recording functions
   const resetRecording = () => {
      deleteRecordingFile();
      setRecording(null);
   };

   const deleteRecordingFile = async () => {
      try {
         const info = await FileSystem.getInfoAsync(recording.getURI());
         await FileSystem.deleteAsync(info.uri);
      } catch (error) {
         console.log('There was an error deleting recording file', error);
      }
   };

   const stopRecording = async () => {
      setIsRecording(false);
      try {
         await recording.stopAndUnloadAsync();
      } catch (error) {
         // Do nothing -- we are already unloaded.
         console.log('Error on stop');
      }
   };

   const startRecording = async () => {
      setIsRecording(true);
      console.log('recording permissions ....');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
         allowsRecordingIOS: true,
         playsInSilentModeIOS: true,
         shouldDuckAndroid: true,
         playThroughEarpieceAndroid: true,
      });
      console.log('recording start ...........');
      const recording = new Audio.Recording();

      try {
         await recording.prepareToRecordAsync(recordingOptions);
         await recording.startAsync();
      } catch (error) {
         console.log('error on start record ', error);
         stopRecording();
      }

      setRecording(recording);
   };

   const getTranscription = async () => {
      setIsFetching(true);
      try {
         const info = recording.getURI();
         //console.log(`FILE INFO: ${info}`);
         await Sharing.shareAsync(info);
         /*await LoiService.speechToText(info.uri);
         console.log('transcription function passé.');*/
         /*const resumable = FileSystem.createDownloadResumable(
            info.uri,
            FileSystem.documentDirectory + 'audio.m4a',
            {},
            (progr) => {
               const progress =
                  progr.totalBytesWritten / progr.totalBytesExpectedToWrite;
               console.log('progres : ', progress);
            }
         );

         await resumable.downloadAsync();
         console.log('download finish');*/
         /*const uri = info.uri;
         const formData = new FormData();
         formData.append('file', {
            uri,
            type: 'audio/x-wav',
            name: 'speech2text',
         });*/
      } catch (error) {
         console.log('There was an error reading file', error);
         stopRecording();
         resetRecording();
      }
      setIsFetching(false);
   };

   const handleOnPressIn = () => {
      startRecording();
   };

   const handleOnPressOut = () => {
      stopRecording();
      getTranscription();
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
                           alert('PDF');
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
                           <TouchableOpacity
                              activeOpacity={0.7}
                              onPressIn={handleOnPressIn}
                              onPressOut={handleOnPressOut}
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
                        </View>

                        <View style={styles.view_for_input_search}>
                           <TextInput
                              style={styles.input}
                              keyboardType="email-address"
                              placeholder={
                                 langueActual === 'fr'
                                    ? 'Entrer le mot de recherche ...'
                                    : 'Ampidiro ny teny hotadiavina...'
                              }
                              value={valueForSearch}
                              onChangeText={(text) =>
                                 onHandleChangeValueSearch(text)
                              }
                           />
                           <TouchableOpacity
                              activeOpacity={0.8}
                              /*onPress={() => {
                        findObjectContainValueSearch(valueForSearch);
                     }}*/
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
                                    <Text>{thematiqueChecked}</Text>
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
                                    <Text>{typeChecked}</Text>
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
               initialNumToRender={5}
               maxToRenderPerBatch={3}
            />
         </SafeAreaView>

         <BottomSheet
            ref={bottomSheetTypeRef}
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
            </View>
         </BottomSheet>

         <BottomSheet
            ref={bottomSheetThematiqueRef}
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
            </View>
         </BottomSheet>
      </View>
   );
}
