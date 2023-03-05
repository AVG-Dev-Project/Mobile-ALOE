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
import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
} from 'react-native-popup-menu';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import RenderHtml from 'react-native-render-html';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import bgImage from '_images/bg_loi.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function Detail({ navigation, route }) {
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const { width } = useWindowDimensions();
   let widthDevice = Dimensions.get('window').width;
   const dispatch = useDispatch();
   const [isSpeakPlay, setIsSpeakPlay] = useState(false);
   const oneArticle = route.params.articleToViewDetail;

   //all functions
   /*function to speach article*/
   const playPauseSpeak = (txt_to_say) => {
      if (isSpeakPlay) {
         Speech.stop();
      } else {
         Speech.speak(txt_to_say);
      }
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
         fontSize: widthDevice < 380 ? 14 : 19,
      },
   };

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
                        fontSize: widthDevice < 370 ? 18 : 22,
                        width: '90%',
                        color: Colors.white,
                     }}
                  >
                     {langueActual === 'fr'
                        ? oneArticle.titre_fr
                        : oneArticle.titre_mg}
                  </Text>
                  <Text
                     style={{
                        fontSize: 12,
                        marginVertical: 8,
                        color: Colors.white,
                     }}
                  >
                     {langueActual === 'fr' ? 'Publié le ' : 'Nivoaka ny '} :{' '}
                     {oneArticle.article_created_at?.substring(0, 10)}
                  </Text>
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

                     <TouchableOpacity activeOpacity={0.7}>
                        <Menu>
                           {/* <MenuTrigger text="Select" /> */}
                           <MenuTrigger customStyles={{}}>
                              <Text style={styles.boutton_info_article}>
                                 <Icon
                                    name={'info-outline'}
                                    color={Colors.violet}
                                    size={32}
                                 />{' '}
                              </Text>
                           </MenuTrigger>
                           <MenuOptions
                              customStyles={{
                                 optionsContainer: {
                                    padding: 8,
                                    width: 340,
                                    height: 370,
                                 },
                                 optionText: {
                                    fontSize: 22,
                                 },
                              }}
                           >
                              <MenuOption>
                                 <Text style={{ fontSize: 22 }}>
                                    {langueActual === 'fr'
                                       ? 'Plus de détails :'
                                       : 'Fanampiny misimisy :'}{' '}
                                    :{' '}
                                 </Text>
                              </MenuOption>
                              <MenuOption>
                                 <Text style={styles.label_info_article}>
                                    {langueActual === 'fr'
                                       ? 'Chapitre '
                                       : 'Lohateny'}{' '}
                                 </Text>
                                 <Text style={styles.value_info_article}>
                                    <Icon
                                       name={'star'}
                                       color={Colors.violet}
                                       size={16}
                                    />{' '}
                                    {langueActual === 'fr'
                                       ? oneArticle.chapitre_titre_fr ?? ''
                                       : oneArticle.chapitre_titre_mg ?? ''}
                                 </Text>
                              </MenuOption>
                              <MenuOption>
                                 <Text style={styles.label_info_article}>
                                    {langueActual === 'fr'
                                       ? 'Contenu '
                                       : 'Sokajy '}{' '}
                                 </Text>
                                 <Text style={styles.value_info_article}>
                                    <Icon
                                       name={'star'}
                                       color={Colors.violet}
                                       size={16}
                                    />{' '}
                                    {langueActual === 'fr'
                                       ? oneArticle.contenu
                                       : oneArticle.contenu}
                                 </Text>
                              </MenuOption>
                           </MenuOptions>
                        </Menu>
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
      </View>
   );
}
