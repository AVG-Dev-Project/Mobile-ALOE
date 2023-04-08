import {
   View,
   Text,
   StyleSheet,
   StatusBar,
   ImageBackground,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   Platform,
   ToastAndroid,
   useWindowDimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import React, {
   useState,
   useEffect,
   useMemo,
   useRef,
   useCallback,
} from 'react';
import RenderHtml from 'react-native-render-html';
import * as MediaLibrary from 'expo-media-library';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { printToFileAsync } from 'expo-print';
import bgImage from '_images/bg_loi.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
// import { addFavoris } from '_utils/redux/actions/action_creators';
import { captureRef } from 'react-native-view-shot';

export default function Detail({ navigation, route }) {
   const [status, requestPermission] = MediaLibrary.usePermissions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const { width, height } = useWindowDimensions();
   const dispatch = useDispatch();
   const [isSpeakPlay, setIsSpeakPlay] = useState(false);
   const oneArticle = route.params.articleToViewDetail;
   const snapPoints = useMemo(
      () => (height < 700 ? [0, '60%'] : [0, '60%']),
      []
   );

   //permission
   if (status === null) {
      requestPermission();
   }

   //all refs
   const bottomSheetRef = useRef(null);
   const imageRef = useRef();

   //all functions

   if (status === null) {
      requestPermission();
   }

   /*function to speach article*/
   const playPauseSpeak = (txt_to_say) => {
      if (isSpeakPlay) {
         Speech.stop();
      } else {
         Speech.speak(
            txt_to_say ?? langueActual === 'fr'
               ? "Pas d'article à lire"
               : 'Tsy misy dikan-teny malagasy ilay lahatsoratra.',
            { language: 'fr-FR' }
         );
      }
   };

   const openBottomSheet = () => {
      return bottomSheetRef.current.snapTo(1);
   };

   const onSaveImageAsync = async () => {
      try {
         const localUri = await captureRef(imageRef, {
            quality: 1,
         });

         await MediaLibrary.saveToLibraryAsync(localUri);
         if (localUri) {
            ToastAndroid.show(
               langueActual === 'fr'
                  ? `Article n°${oneArticle.numero} télecharger dans votre galérie.`
                  : `Lahatsoratra faha${oneArticle.numero} azo ao anaty lisitry ny sarinao.`,
               ToastAndroid.SHORT
            );
         }
      } catch (e) {
         ToastAndroid.show(
            langueActual === 'fr'
               ? `La capture a été intérompu. Veuillez réessayer!`
               : "Nisy olana teo amin'ny fangalana ny sary.",
            ToastAndroid.SHORT
         );
      }
   };

   const downloadAsPdf = async () => {
      const html = `
         <html>
            <body>
               <h1 style="text-align: center; color: ${
                  Colors.greenAvg
               }">Article n° ${oneArticle.numero}</h1>
               <h3 style="text-align: center;">Titre : ${
                  langueActual === 'fr'
                     ? oneArticle.titre_fr
                     : oneArticle.titre_mg
               }</h3>
               <h3 style="text-decoration: underline">Contenu de l'article : </h3>
               <p style="width: 90%">${
                  langueActual === 'fr'
                     ? oneArticle.contenu_fr?.split('________________')[0]
                     : oneArticle.contenu_mg?.split('________________')[0]
               }</p>
            </body>
         </html>
      `;

      const file = await printToFileAsync({
         html: html,
         base64: false,
      });
      await saveToDownloadDirectory(file.uri);
   };

   const saveToDownloadDirectory = async (uri) => {
      try {
         const asset = await MediaLibrary.createAssetAsync(uri);
         const album = await MediaLibrary.getAlbumAsync('Download');
         if (album === null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
         } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            ToastAndroid.show(
               langueActual === 'fr'
                  ? `Article n°${oneArticle.numero} télecharger dans votre télephone!`
                  : `Lahatsoratra faha${oneArticle.numero} azo anaty findainao!`,
               ToastAndroid.SHORT
            );
         }
      } catch (e) {
         ToastAndroid.show(
            langueActual === 'fr'
               ? 'Erreur durant le télechargement du pdf'
               : 'Nisy olana teo ampangalana ny pdf.',
            ToastAndroid.LONG
         );
      }
   };

   // const showToastFavorite = () => {
   //    ToastAndroid.show('Vos favoris on été modifié', ToastAndroid.SHORT);
   // };

   const sourceHTML = (data) => {
      const source = {
         html:
            data ?? '<p>Tsy misy dikan-teny malagasy ity lahatsoratra ity.</p>',
      };
      return source;
   };

   const tagsStyles = useMemo(
      () => ({
         p: {
            width: '100%',
            fontSize: width < 380 ? 14 : 18,
         },
      }),
      []
   );

   //all efects
   useEffect(() => {
      bottomSheetRef.current.close();
   }, []);

   //all components
   const renderBackDrop = useCallback(
      (props) => <BottomSheetBackdrop {...props} opacity={0.6} />,
      []
   );

   return (
      <View style={styles.view_container}>
         <StatusBar backgroundColor={Colors.greenAvg} />
         <SafeAreaView style={styles.container_safe}>
            <ImageBackground
               source={bgImage}
               style={{
                  height: 230,
               }}
               imageStyle={{
                  resizeMode: 'cover',
               }}
            >
               <View
                  style={[
                     StyleSheet.absoluteFillObject,
                     styles.maskImageDetailArticle,
                  ]}
               ></View>
               <View ref={imageRef} collapsable={false}>
                  <View style={styles.info_in_landing_detail}>
                     <Text
                        style={{
                           fontWeight: 'bold',
                           fontSize: width < 370 ? 18 : 20,
                           marginBottom: 8,
                           width: '90%',
                           color: Colors.white,
                        }}
                     >
                        {langueActual === 'fr'
                           ? oneArticle.titre_fr
                           : oneArticle.titre_mg ??
                             'Tsy misy dikan-teny malagasy.'}
                     </Text>
                     {oneArticle.chapitre_id && (
                        <Text
                           style={{
                              fontSize: 13,
                              marginVertical: 4,
                              color: Colors.white,
                           }}
                        >
                           {langueActual === 'fr'
                              ? `Chapitre n°${oneArticle.chapitre_numero}`
                              : `Lohateny faha ${oneArticle.chapitre_numero}`}{' '}
                           :{' '}
                           {langueActual === 'fr'
                              ? oneArticle.chapitre_titre_fr
                              : oneArticle.chapitre_titre_mg ??
                                'Tsy misy ny dikan-teny malagasy.'}
                        </Text>
                     )}
                  </View>
                  <View style={styles.description_section}>
                     <View style={styles.view_round_button_detail_article}>
                        {/* <TouchableOpacity
                        onPress={() => {
                           dispatch(addFavoris(oneArticle.id));
                           showToastFavorite();
                        }}
                        activeOpacity={0.7}
                     >
                        <Text style={styles.boutton_add_favorite}>
                           <Icon
                              name={'favorite'}
                              color={Colors.greenAvg}
                              size={32}
                           />{' '}
                        </Text>
                     </TouchableOpacity> */}

                        <TouchableOpacity
                           activeOpacity={0.7}
                           onPress={() => openBottomSheet()}
                        >
                           <Text style={styles.boutton_info_article}>
                              <Icon
                                 name={'info-outline'}
                                 color={Colors.greenAvg}
                                 size={32}
                              />{' '}
                           </Text>
                        </TouchableOpacity>
                     </View>

                     <Text
                        style={{
                           fontSize: 22,
                           fontWeight: 'bold',
                           marginTop: 18,
                        }}
                     >
                        {langueActual === 'fr'
                           ? "Contenu de l'article "
                           : "Votoatin'ny lahatsoratra"}
                     </Text>
                     <ScrollView
                        style={{
                           paddingRight: 4,
                        }}
                     >
                        {langueActual === 'fr' ? (
                           <RenderHtml
                              contentWidth={width}
                              source={sourceHTML(
                                 oneArticle.contenu_fr?.split(
                                    '________________'
                                 )[1]
                              )}
                              tagsStyles={tagsStyles}
                           />
                        ) : (
                           <RenderHtml
                              contentWidth={width}
                              source={sourceHTML(
                                 oneArticle.contenu_mg?.split(
                                    '________________'
                                 )[1]
                              )}
                              tagsStyles={tagsStyles}
                           />
                        )}
                     </ScrollView>
                  </View>
               </View>
               <View style={styles.all_button_in_detail_screen}>
                  <TouchableOpacity
                     onPress={() => {
                        onSaveImageAsync();
                     }}
                  >
                     <Text style={styles.button_in_detail}>
                        {' '}
                        <Icon
                           name={'image'}
                           size={34}
                           color={Colors.greenAvg}
                        />{' '}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => {
                        downloadAsPdf();
                     }}
                  >
                     <Text style={styles.button_in_detail}>
                        {' '}
                        <Icon
                           name={'picture-as-pdf'}
                           size={34}
                           color={Colors.greenAvg}
                        />{' '}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => {
                        setIsSpeakPlay(!isSpeakPlay);
                        if (langueActual === 'fr') {
                           playPauseSpeak(
                              oneArticle.contenu_fr
                                 ?.split('________________')[0]
                                 .substring(0, 4000)
                           );
                        } else {
                           playPauseSpeak(
                              oneArticle.contenu_mg
                                 ?.split('________________')[0]
                                 .substring(0, 4000)
                           );
                        }
                     }}
                  >
                     <Text style={[styles.button_in_detail]}>
                        {' '}
                        <Icon
                           name={isSpeakPlay ? 'stop' : 'play-circle-outline'}
                           size={34}
                           color={Colors.greenAvg}
                        />{' '}
                     </Text>
                  </TouchableOpacity>
               </View>
            </ImageBackground>
         </SafeAreaView>

         <BottomSheet
            backdropComponent={renderBackDrop}
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            style={styles.view_bottom_sheet}
         >
            <View style={styles.view_in_bottomsheet}>
               <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
                  {langueActual === 'fr'
                     ? 'Plus de détails :'
                     : 'Fanampiny misimisy :'}{' '}
               </Text>
               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Chapitre ' : 'Lohateny'}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {langueActual === 'fr'
                        ? oneArticle.chapitre_titre_fr ?? ''
                        : oneArticle.chapitre_titre_mg ??
                          'Tsy misy dikan-teny malagasy.'}
                  </Text>
               </View>
               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Contenu ' : 'Sokajy '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {langueActual === 'fr'
                        ? oneArticle.contenu
                        : oneArticle.contenu}
                  </Text>
               </View>
            </View>
         </BottomSheet>
      </View>
   );
}
