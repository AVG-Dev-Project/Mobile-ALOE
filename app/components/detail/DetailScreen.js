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
} from 'react-native';
import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
} from 'react-native-popup-menu';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
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
   const dispatch = useDispatch();
   const [isSpeakPlay, setIsSpeakPlay] = useState(false);
   const oneArticle = route.params.articleToViewDetail;

   /*function to speach article*/
   const playPauseSpeak = (txt_to_say) => {
      if (isSpeakPlay) {
         Speech.stop();
      } else {
         Speech.speak(txt_to_say);
      }
   };

   return (
      <View style={styles.view_container}>
         <StatusBar
            backgroundColor={'transparent'}
            animated={true}
            translucent={true}
         />
         <SafeAreaView style={styles.container_safe}>
            <ImageBackground
               source={bgImage}
               style={{
                  height: Dimensions.get('window').height < 700 ? 340 : 420,
               }}
               imageStyle={{
                  resizeMode: 'cover',
               }}
            >
               <View
                  style={[StyleSheet.absoluteFillObject, styles.maskImageCatg]}
               ></View>
               <View style={styles.info_in_landing_detail}>
                  <Text
                     style={{
                        fontWeight: 'bold',
                        fontSize: 22,
                        width: '90%',
                        color: Colors.white,
                     }}
                  >
                     {langueActual === 'fr'
                        ? oneArticle.Titre.titre_fr
                        : oneArticle.Titre.titre_mg}
                  </Text>
                  <Text
                     style={{
                        fontSize: 12,
                        marginTop: 8,
                        color: Colors.white,
                     }}
                  >
                     {langueActual === 'fr' ? 'Publié le ' : 'Nivoaka ny '} :{' '}
                     {oneArticle.date_created?.substring(0, 10)}
                  </Text>
               </View>
               <View style={styles.description_section}>
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
                                    ? 'Thématiques '
                                    : 'Lohahevitra'}{' '}
                              </Text>
                              <Text style={styles.value_info_article}>
                                 <Icon
                                    name={'star'}
                                    color={Colors.violet}
                                    size={16}
                                 />{' '}
                                 {langueActual === 'fr'
                                    ? oneArticle.Thematique.nom_Thematique_fr
                                    : oneArticle.Thematique.nom_Thematique_mg}
                              </Text>
                           </MenuOption>
                           <MenuOption>
                              <Text style={styles.label_info_article}>
                                 {langueActual === 'fr'
                                    ? 'Types '
                                    : 'Karazana '}{' '}
                              </Text>
                              <Text style={styles.value_info_article}>
                                 <Icon
                                    name={'star'}
                                    color={Colors.violet}
                                    size={16}
                                 />{' '}
                                 {langueActual === 'fr'
                                    ? oneArticle.Type.nom_Type_fr
                                    : oneArticle.Type.nom_Type_mg}
                              </Text>
                           </MenuOption>
                           <MenuOption>
                              <Text style={styles.label_info_article}>
                                 {langueActual === 'fr'
                                    ? 'Section '
                                    : 'Faritra'}{' '}
                              </Text>
                              <Text style={styles.value_info_article}>
                                 <Icon
                                    name={'star'}
                                    color={Colors.violet}
                                    size={16}
                                 />{' '}
                                 {langueActual === 'fr'
                                    ? oneArticle.Section.nom_Section_fr
                                    : oneArticle.Section.nom_Section_mg ??
                                      '...'}
                              </Text>
                           </MenuOption>
                           <MenuOption>
                              <Text style={styles.label_info_article}>
                                 {langueActual === 'fr'
                                    ? 'Sous section '
                                    : 'Fizarana anatiny '}{' '}
                              </Text>
                              <Text style={styles.value_info_article}>
                                 <Icon
                                    name={'star'}
                                    color={Colors.violet}
                                    size={16}
                                 />{' '}
                                 {oneArticle.Sous_section.numero_sous_section ??
                                    '...'}
                              </Text>
                           </MenuOption>
                           <MenuOption>
                              <Text style={styles.label_info_article}>
                                 {langueActual === 'fr'
                                    ? 'Intitulé '
                                    : 'Mitondra ny lohateny hoe'}{' '}
                              </Text>
                              <Text style={styles.value_info_article}>
                                 <Icon
                                    name={'star'}
                                    color={Colors.violet}
                                    size={16}
                                 />{' '}
                                 {oneArticle.Intutile.contenu_intutile ?? '...'}
                              </Text>
                           </MenuOption>
                        </MenuOptions>
                     </Menu>
                  </TouchableOpacity>

                  <Text
                     style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 14,
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
                     <Text
                        style={{
                           fontSize:
                              Dimensions.get('window').height < 700 ? 15 : 18,
                           textAlign: 'left',
                        }}
                     >
                        {langueActual === 'fr'
                           ? oneArticle.Article.contenu_Article_fr
                           : oneArticle.Article.contenu_Article_mg}
                     </Text>
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
                                 oneArticle.Article.contenu_Article_fr.substring(
                                    0,
                                    4000
                                 )
                              );
                           } else {
                              playPauseSpeak(
                                 oneArticle.Article.contenu_Article_mg.substring(
                                    0,
                                    4000
                                 )
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
