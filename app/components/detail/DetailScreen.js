import {
   View,
   Text,
   StyleSheet,
   StatusBar,
   ImageBackground,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
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
import { captureRef } from 'react-native-view-shot';
import RenderHtml from 'react-native-render-html';
import { useDispatch, useSelector } from 'react-redux';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as MediaLibrary from 'expo-media-library';
import { styles } from './styles';
import { Icon, FAB } from '@rneui/themed';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { printToFileAsync } from 'expo-print';
import bgImage from '_images/bg_loi.jpg';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function Detail({ navigation, route }) {
   const [status, requestPermission] = MediaLibrary.usePermissions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const { width, height } = useWindowDimensions();
   const dispatch = useDispatch();
   const [isSpeakPlay, setIsSpeakPlay] = useState(false);
   const allContenus = useSelector((selector) => selector.loi.contenus);
   const [isFABshow, setIsFABshow] = useState(false);
   const oneArticle = route.params.articleToViewDetail;
   const [contenuMother, setContenuMother] = useState(
      allContenus.filter((contenu) => contenu.id === oneArticle.contenu)
   );
   const allFavoriteIdFromStore = useSelector(
      (selector) => selector.loi.favoris
   );
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
               <h1 style="text-align: center; color: ${Colors.greenAvg}">${
         langueActual === 'fr'
            ? contenuMother[0].type_nom_fr + ' n°'
            : contenuMother[0].type_nom_mg ?? 'Votoantiny' + ' faha '
      }
               ${contenuMother[0].numero}</h1>
               <h2 style="text-align: center; color: ${
                  Colors.greenAvg
               }">Article n° ${oneArticle.numero}</h2>
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
         const filename = `Article n° ${oneArticle.numero}/${
            oneArticle.titre_fr ?? ''
         }`;
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
            `Article n° ${oneArticle.numero} télecharger dans download/aloe/pdf.`,
            ToastAndroid.SHORT
         );
      } catch (e) {
         ToastAndroid.show(
            langueActual === 'fr'
               ? 'Erreur durant le télechargement du pdf'
               : 'Nisy olana teo ampangalana ny pdf.',
            ToastAndroid.LONG
         );
      }
   };

   const showToastFavorite = () => {
      if (allFavoriteIdFromStore.includes(oneArticle.id)) {
         ToastAndroid.show(
            `Article n° ${oneArticle.numero} retiré dans vos favoris.`,
            ToastAndroid.SHORT
         );
      } else {
         ToastAndroid.show(
            `Article n° ${oneArticle.numero} ajouté dans vos favoris.`,
            ToastAndroid.SHORT
         );
      }
   };

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
                           fontSize: width < 370 ? 18 : 24,
                           textDecorationLine: 'underline',
                           marginBottom: 8,
                           textAlign: 'center',
                           width: '90%',
                           color: Colors.white,
                        }}
                     >
                        {langueActual === 'fr'
                           ? contenuMother[0].type_nom_fr + ' n°'
                           : contenuMother[0].type_nom_mg ??
                             'Votoantiny' + ' faha '}{' '}
                        {contenuMother[0].numero}
                     </Text>
                     <Text
                        style={{
                           fontWeight: 'bold',
                           fontSize: width < 370 ? 16 : 18,
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
                        <TouchableOpacity
                           onPress={() => {
                              dispatch(addFavoris(oneArticle.id));
                              showToastFavorite();
                           }}
                           activeOpacity={0.7}
                        >
                           <Text style={styles.boutton_add_favorite}>
                              <Icon
                                 name={
                                    allFavoriteIdFromStore.includes(
                                       oneArticle.id
                                    )
                                       ? 'favorite'
                                       : 'favorite-border'
                                 }
                                 color={Colors.greenAvg}
                                 size={32}
                              />{' '}
                           </Text>
                        </TouchableOpacity>

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
               <View style={styles.fab_button}>
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
                     icon={{ name: 'add', color: 'white' }}
                     color={Colors.greenAvg}
                  />
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
            <ScrollView style={styles.view_in_bottomsheet}>
               <View>
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
                           ? contenuMother[0].type_nom_fr + ' n°'
                           : contenuMother[0].type_nom_mg ??
                             'Votoantiny' + ' faha '}{' '}
                        {contenuMother[0].numero}
                     </Text>
                  </View>

                  <View style={styles.view_one_item_in_bottomsheet}>
                     <Text style={styles.label_info_article}>
                        {langueActual === 'fr' ? 'Thématique ' : 'Lohahevitra '}{' '}
                     </Text>
                     <Text style={styles.value_info_article}>
                        <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                        {langueActual === 'fr'
                           ? contenuMother[0].thematique_nom_fr
                           : contenuMother[0].thematique_nom_mg ??
                             contenuMother[0].thematique_nom_fr}
                     </Text>
                  </View>

                  <View style={styles.view_one_item_in_bottomsheet}>
                     <Text style={styles.label_info_article}>
                        {langueActual === 'fr' ? 'Type ' : 'Sokajy '}{' '}
                     </Text>
                     <Text style={styles.value_info_article}>
                        <Icon name={'star'} color={Colors.greenAvg} size={16} />{' '}
                        {langueActual === 'fr'
                           ? contenuMother[0].type_nom_fr
                           : contenuMother[0].type_nom_mg ??
                             contenuMother[0].type_nom_fr}
                     </Text>
                  </View>
               </View>
            </ScrollView>
         </BottomSheet>
      </View>
   );
}
