import {
   View,
   Text,
   StyleSheet,
   StatusBar,
   ImageBackground,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   Dimensions,
   useWindowDimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import RenderHtml from 'react-native-render-html';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import BottomSheet from '@gorhom/bottom-sheet';
import bgImage from '_images/bg_loi.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function Detail({ navigation, route }) {
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const { width, height } = useWindowDimensions();
   const dispatch = useDispatch();
   const [isSpeakPlay, setIsSpeakPlay] = useState(false);
   const oneArticle = route.params.articleToViewDetail;
   const snapPoints = useMemo(
      () => (height < 700 ? [-1, '60%'] : [-1, '60%']),
      []
   );

   //all refs
   const bottomSheetRef = useRef(null);

   //all functions
   /*function to speach article*/
   const playPauseSpeak = (txt_to_say) => {
      if (isSpeakPlay) {
         Speech.stop();
      } else {
         Speech.speak(txt_to_say);
      }
   };

   const openBottomSheet = () => {
      return bottomSheetRef.current.snapTo(1);
   };

   const sourceHTML = (data) => {
      const source = {
         html: data,
      };
      return source;
   };

   const tagsStyles = {
      p: {
         width: '100%',
         fontSize: width < 380 ? 14 : 18,
      },
   };

   //all efects
   useEffect(() => {
      bottomSheetRef.current.close();
   }, []);

   return (
      <View style={styles.view_container}>
         <StatusBar backgroundColor={Colors.violet} />
         <SafeAreaView style={styles.container_safe}>
            <ImageBackground
               source={bgImage}
               style={{
                  height: 250,
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
                        : oneArticle.titre_mg}
                  </Text>
                  {oneArticle.chapitre_id && (
                     <Text
                        style={{
                           fontSize: 12,
                           marginVertical: 8,
                           color: Colors.white,
                        }}
                     >
                        {langueActual === 'fr'
                           ? `Chapitre n°${oneArticle.chapitre_numero}`
                           : `Lohateny faha ${oneArticle.chapitre_numero}`}{' '}
                        :{' '}
                        {langueActual === 'fr'
                           ? oneArticle.chapitre_titre_fr
                           : oneArticle.chapitre_titre_mg}
                     </Text>
                  )}
               </View>
               <View style={styles.description_section}>
                  <View style={styles.view_round_button_detail_article}>
                     <TouchableOpacity
                        onPress={() => {
                           dispatch(addFavoris(oneArticle));
                           alert(
                              langueActual === 'fr'
                                 ? 'Ajouté au favoris'
                                 : "Niampy ao amin'ny ankafizina"
                           );
                        }}
                     >
                        <Text style={styles.boutton_add_favorite}>
                           <Icon
                              name={'favorite'}
                              color={Colors.violet}
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
                              color={Colors.violet}
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
                           source={sourceHTML(oneArticle.contenu_fr)}
                           tagsStyles={tagsStyles}
                        />
                     ) : (
                        <RenderHtml
                           contentWidth={width}
                           source={sourceHTML(oneArticle.contenu_mg)}
                           tagsStyles={tagsStyles}
                        />
                     )}
                  </ScrollView>
                  <View style={styles.all_button_in_detail_screen}>
                     <TouchableOpacity
                        onPress={() => {
                           alert('télechargés en PDF');
                        }}
                     >
                        <Text style={styles.button_in_detail}>
                           {' '}
                           <Icon
                              name={'picture-as-pdf'}
                              size={34}
                              color={Colors.violet}
                           />{' '}
                        </Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        onPress={() => {
                           setIsSpeakPlay(!isSpeakPlay);
                           if (langueActual === 'fr') {
                              playPauseSpeak(
                                 oneArticle.contenu_fr.substring(0, 4000)
                              );
                           } else {
                              playPauseSpeak(
                                 oneArticle.contenu_mg.substring(0, 4000)
                              );
                           }
                        }}
                     >
                        <Text style={[styles.button_in_detail]}>
                           {' '}
                           <Icon
                              name={
                                 isSpeakPlay ? 'stop' : 'play-circle-outline'
                              }
                              size={34}
                              color={Colors.violet}
                           />{' '}
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </ImageBackground>
         </SafeAreaView>

         <BottomSheet
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
                     <Icon name={'star'} color={Colors.violet} size={16} />{' '}
                     {langueActual === 'fr'
                        ? oneArticle.chapitre_titre_fr ?? ''
                        : oneArticle.chapitre_titre_mg ?? ''}
                  </Text>
               </View>
               <View style={styles.view_one_item_in_bottomsheet}>
                  <Text style={styles.label_info_article}>
                     {langueActual === 'fr' ? 'Contenu ' : 'Sokajy '}{' '}
                  </Text>
                  <Text style={styles.value_info_article}>
                     <Icon name={'star'} color={Colors.violet} size={16} />{' '}
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
