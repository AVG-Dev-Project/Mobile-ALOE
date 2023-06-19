import {
   View,
   Text,
   StyleSheet,
   StatusBar,
   ImageBackground,
   Platform,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   ToastAndroid,
   useWindowDimensions,
} from 'react-native';
import { ScrollView as ScrollViewBottomSheet } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { captureRef } from 'react-native-view-shot';
import RenderHtml from 'react-native-render-html';
import { useSelector } from 'react-redux';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as MediaLibrary from 'expo-media-library';
import { styles } from './styles';
import { Icon, FAB, Button } from '@rneui/themed';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { printToFileAsync } from 'expo-print';
import bgImage from '_images/abstract_3.jpg';
import { Colors } from '_theme/Colors';
import { parsingTags, heightPercentageToDP } from '_utils';

export default function DetailEnteteScreen({ navigation, route }) {
   const [status, requestPermission] = MediaLibrary.usePermissions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const { width } = useWindowDimensions();
   const [isSpeakPlay, setIsSpeakPlay] = useState(false);
   const [isFABshow, setIsFABshow] = useState(false);
   const [fontSizeDynamic, setFontSizeDynamic] = useState(
      width < 380 ? 14 : 18
   );
   const [contenuMother, setContenuMother] = useState(
      route.params.contenuMother
   );
   const typeOfData = route.params.typeOfData;
   const snapPoints = useMemo(() => [0, '60%', '90%'], []);

   //permission
   if (status === null) {
      requestPermission();
   }

   //all refs
   const bottomSheetRef = useRef(null);
   const imageRef = useRef();

   //all function

   /*function to speach article*/
   const playPauseSpeak = (txt_to_say) => {
      if (isSpeakPlay) {
         Speech.stop();
      } else {
         Speech.speak(
            txt_to_say ??
               (langueActual === 'fr'
                  ? "Pas d'artcile à lire"
                  : 'Tsy misy dikan-teny malagasy ilay lahatsoratra.'),
            { language: 'fr-FR' }
         );
      }
   };

   const openBottomSheet = () => {
      return bottomSheetRef.current.present();
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
                  ? `Image sauvegarder dans votre galérie.`
                  : `Lahatsoratra voatahiry ao anaty lisitry ny sarinao.`,
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
                <h1 style="text-align: center; color: ${Colors.greenAvg}">${
         langueActual === 'fr'
            ? contenuMother.type_nom_fr + ' n°'
            : contenuMother.type_nom_mg ?? contenuMother.type_nom_fr + ' n°'
      }
                ${contenuMother.numero}</h1>
                <h3 style="text-align: left;">Date: <span style="font-weight: normal;">${
                   contenuMother.date
                }</span></h3>
                <h3 style="text-align: left;">Numero: <span style="font-weight: normal;">${
                   contenuMother.numero
                }</span></h3>

                <h3 style="text-decoration: underline; color: ${
                   Colors.greenAvg
                }">VISA</h3>
                 <p style="width: 90%">${
                    langueActual === 'fr'
                       ? contenuMother.en_tete_contenu_fr_mobile?.split(
                            '________________'
                         )[0]
                       : contenuMother.en_tete_contenu_mg_mobile?.split(
                            '________________'
                         )[0]
                 }</p>

                 <h3 style="text-decoration: underline; color: ${
                    Colors.greenAvg
                 }">Exposé des motifs</h3>
                 <p style="width: 90%">${
                    langueActual === 'fr'
                       ? contenuMother.expose_des_motifs_contenu_fr_mobile?.split(
                            '________________'
                         )[0]
                       : contenuMother.expose_des_motifs_contenu_mg_mobile?.split(
                            '________________'
                         )[0]
                 }</p>

                <h3 style="text-align: left;">Type: <span style="font-weight: normal;">${
                   langueActual === 'fr'
                      ? contenuMother.type_nom_fr
                      : contenuMother.type_nom_mg ?? contenuMother.type_nom_fr
                }</span></h3>
                <h3 style="text-align: left;">Thematique: <span style="font-weight: normal;">${
                   langueActual === 'fr'
                      ? contenuMother.thematique_nom_fr
                      : contenuMother.thematique_nom_mg ??
                        contenuMother.thematique_nom_fr
                }</span></h3>
                <h3 style="text-align: left;">Objet: <span style="font-weight: normal;">${
                   langueActual === 'fr'
                      ? contenuMother.objet_contenu_fr ?? ' '
                      : contenuMother.objet_contenu_mg ?? ' '
                }</span></h3>
                <h3 style="text-align: left;">Etat: <span style="font-weight: normal;">${
                   langueActual === 'fr'
                      ? contenuMother.etat_nom_fr ?? ' '
                      : contenuMother.etat_nom_mg ?? ' '
                }</span></h3>
                <h3 style="text-align: left;">Organisme: <span style="font-weight: normal;">${
                   langueActual === 'fr'
                      ? contenuMother.organisme_nom_fr ?? ' '
                      : contenuMother.organisme_nom_mg ?? ' '
                }</span></h3>
                <h3 style="text-align: left;">Note: <span style="font-weight: normal;">${
                   langueActual === 'fr'
                      ? contenuMother.note_contenu_fr ?? ' '
                      : contenuMother.note_contenu_mg ?? ' '
                }</span></h3>
                
                <footer style="margin-top: 100px; font-size: 12px;text-align:center;">
                   PDF généré par l'application de l'Alliance Voary Gasy ou AVG
                </footer>
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
         //for version 10 and up
         if (Platform.Version >= 29) {
            const filename = `${
               typeOfData === 'VISA' ? 'VISA du' : 'Exposé des motifs du'
            } ${contenuMother.type_nom_fr} ${contenuMother.numero ?? ''}`;
            await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
               {
                  name: filename,
                  parentFolder: 'aloe/pdf',
                  mimeType: 'application/pdf',
               },
               'Download',
               uri.replace('file://', '')
            );
            ToastAndroid.show(
               `Fichier télecharger dans download/aloe/pdf.`,
               ToastAndroid.SHORT
            );
         }

         // for version 9 and down
         if (Platform.Version < 29) {
            const asset = await MediaLibrary.createAssetAsync(uri);
            const album = await MediaLibrary.getAlbumAsync('Download');
            if (album === null) {
               await MediaLibrary.createAlbumAsync('Download', asset, false);
            } else {
               await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
            ToastAndroid.show(
               `Fichier télecharger dans le dossier download!`,
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

   const sourceHTML = (data) => {
      const source = {
         html: data ?? '<p>Le contenu est vide</p>',
      };
      return source;
   };

   const tagsStyles = useMemo(
      () => ({
         p: {
            width: '100%',
            fontSize: fontSizeDynamic,
         },
      }),
      [fontSizeDynamic]
   );

   //all efects

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
               blurRadius={5}
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
               <View
                  ref={imageRef}
                  collapsable={false}
                  style={styles.content_article_view}
               >
                  <View style={styles.view_header_nav_detail_entete}>
                     <Button
                        type="clear"
                        size="md"
                        onPress={() => navigation.goBack()}
                     >
                        <Icon name="arrow-back" color={Colors.white} />
                     </Button>
                     <Text
                        style={{
                           fontWeight: 'bold',
                           fontSize: width < 370 ? 18 : 22,
                           textDecorationLine: 'underline',
                           marginBottom: 8,
                           textAlign: 'center',
                           width: '90%',
                           color: Colors.white,
                        }}
                     >
                        {typeOfData === 'VISA'
                           ? langueActual === 'fr'
                              ? 'VISA'
                              : 'Fahazoan-dalana'
                           : langueActual === 'fr'
                           ? 'Exposé des motifs'
                           : 'Famelabelarana ny antonantony'}
                     </Text>
                  </View>
                  <View style={styles.description_section}>
                     <View
                        style={
                           styles.view_round_button_detail_article_detail_entete
                        }
                     >
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

                     <View>
                        <ScrollView
                           style={{
                              paddingRight: 4,
                              marginTop: 18,
                           }}
                        >
                           {langueActual === 'fr' ? (
                              <RenderHtml
                                 contentWidth={width}
                                 source={sourceHTML(
                                    typeOfData === 'VISA'
                                       ? contenuMother.en_tete_contenu_fr
                                       : contenuMother.expose_des_motifs_contenu_fr
                                 )}
                                 tagsStyles={tagsStyles}
                              />
                           ) : (
                              <RenderHtml
                                 contentWidth={width}
                                 source={sourceHTML(
                                    typeOfData === 'VISA'
                                       ? contenuMother.en_tete_contenu_mg ??
                                            contenuMother.en_tete_contenu_fr
                                       : contenuMother.expose_des_motifs_contenu_mg ??
                                            contenuMother.expose_des_motifs_contenu_fr
                                 )}
                                 tagsStyles={tagsStyles}
                              />
                           )}
                        </ScrollView>
                     </View>
                  </View>
               </View>
               <View style={styles.fab_button}>
                  <View style={styles.view_button_zoom}>
                     <Button
                        type="clear"
                        size="sm"
                        onPress={() => setFontSizeDynamic(fontSizeDynamic + 2)}
                     >
                        <Icon name="zoom-in" color={Colors.greenAvg} />
                     </Button>
                     <Button
                        type="clear"
                        size="sm"
                        onPress={() => setFontSizeDynamic(fontSizeDynamic - 2)}
                     >
                        <Icon name="zoom-out" color={Colors.greenAvg} />
                     </Button>
                  </View>
                  <View style={styles.view_content_fab_button}>
                     <FAB
                        visible={isFABshow}
                        icon={{ name: 'image', color: 'white' }}
                        color={Colors.greenAvg}
                        onPress={() => {
                           onSaveImageAsync();
                        }}
                     />
                     <FAB
                        visible={isFABshow}
                        icon={{ name: 'picture-as-pdf', color: 'white' }}
                        color={Colors.greenAvg}
                        onPress={() => {
                           downloadAsPdf();
                        }}
                     />
                     <FAB
                        visible={isFABshow}
                        icon={{
                           name: isSpeakPlay ? 'stop' : 'play-circle-outline',
                           color: 'white',
                        }}
                        color={Colors.greenAvg}
                        onPress={() => {
                           setIsSpeakPlay(!isSpeakPlay);
                           if (langueActual === 'fr') {
                              if (typeOfData === 'VISA') {
                                 playPauseSpeak(
                                    contenuMother.en_tete_contenu_fr_mobile
                                       ?.split('________________')[0]
                                       .substring(0, 4000) ??
                                       'Le contenu est vide'
                                 );
                              } else {
                                 playPauseSpeak(
                                    contenuMother.expose_des_motifs_contenu_fr_mobile
                                       ?.split('________________')[0]
                                       .substring(0, 4000) ??
                                       'Le contenu est vide'
                                 );
                              }
                           } else {
                              if (typeOfData === 'VISA') {
                                 playPauseSpeak(
                                    contenuMother.en_tete_contenu_mg_mobile
                                       ?.split('________________')[0]
                                       .substring(0, 4000) ??
                                       'Le contenu est vide.'
                                 );
                              } else {
                                 playPauseSpeak(
                                    contenuMother.expose_des_motifs_contenu_mg_mobile
                                       ?.split('________________')[0]
                                       .substring(0, 4000) ??
                                       'Le contenu est vide.'
                                 );
                              }
                           }
                        }}
                     />
                  </View>

                  <FAB
                     visible={isFABshow}
                     onPress={() => setIsFABshow(!isFABshow)}
                     placement="right"
                     icon={{ name: 'close', color: 'white' }}
                     color={Colors.redError}
                  />
                  <FAB
                     visible={!isFABshow}
                     onPress={() => setIsFABshow(!isFABshow)}
                     placement="right"
                     icon={{ name: 'menu', color: 'white' }}
                     color={Colors.greenAvg}
                  />
               </View>
            </ImageBackground>
         </SafeAreaView>

         <BottomSheetModal
            backdropComponent={renderBackDrop}
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            style={styles.view_bottom_sheet}
         >
            <ScrollViewBottomSheet style={styles.view_in_bottomsheet}>
               <Text
                  style={{
                     fontSize: heightPercentageToDP(3.5),
                     fontWeight: 'bold',
                  }}
               >
                  {langueActual === 'fr'
                     ? 'Plus de détails :'
                     : 'Fanampiny misimisy :'}{' '}
               </Text>
               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Type ' : 'Karazana '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {langueActual === 'fr'
                        ? contenuMother.type_nom_fr ?? ''
                        : contenuMother.type_nom_mg ??
                          contenuMother.type_nom_fr}
                  </Text>
               </View>

               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Numero ' : 'Laharana '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {contenuMother.numero}
                  </Text>
               </View>

               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Objet ' : 'Votoatiny '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {langueActual === 'fr'
                        ? contenuMother.objet_contenu_fr ?? ''
                        : contenuMother.objet_contenu_mg ??
                          contenuMother.objet_contenu_fr}
                  </Text>
               </View>

               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Date ' : 'Marikandro '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {contenuMother.date}
                  </Text>
               </View>

               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Thématique ' : 'Lohahevitra '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {langueActual === 'fr'
                        ? contenuMother.thematique_nom_fr
                        : contenuMother.thematique_nom_mg ??
                          contenuMother.thematique_nom_fr}
                  </Text>
               </View>

               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Note ' : 'Naoty '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                     {langueActual === 'fr'
                        ? contenuMother.note_contenu_fr
                        : contenuMother.note_contenu_mg ??
                          contenuMother.note_contenu_fr}
                  </Text>
               </View>

               {parsingTags(contenuMother.tag).length > 0 && (
                  <View style={styles.view_one_item_in_bottomsheet}>
                     <Text style={styles.label_info_article}>
                        {langueActual === 'fr' ? 'Catégorie ' : 'Sokajy '}{' '}
                     </Text>
                     <Text style={styles.value_info_article}>
                        <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                        {parsingTags(contenuMother.tag)?.map((tag) =>
                           langueActual === 'fr'
                              ? tag.contenu_fr + ', '
                              : tag.contenu_mg + ', '
                        )}
                     </Text>
                  </View>
               )}
            </ScrollViewBottomSheet>
         </BottomSheetModal>
      </View>
   );
}
