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
   useWindowDimensions,
} from 'react-native';
import { ScrollView as ScrollViewBottomSheet } from 'react-native-gesture-handler';
import React, { useState, useMemo, useRef, useCallback } from 'react';
import RenderHtml from 'react-native-render-html';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import * as MediaLibrary from 'expo-media-library';
import { styles } from './styles';
import { Icon, Button } from '@rneui/themed';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import bgImage from '_images/abstract_3.jpg';
import { Colors } from '_theme/Colors';
import {
   parsingTags,
   heightPercentageToDP,
   filterArticleToListByContenu,
} from '_utils';

export default function OverviewScreen({ navigation, route }) {
   const [status, requestPermission] = MediaLibrary.usePermissions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const { width } = useWindowDimensions();
   const [fontSizeDynamic, setFontSizeDynamic] = useState(
      width < 380 ? 14 : 18
   );
   const [contenuMother, setContenuMother] = useState(
      route.params.contenuMother
   );
   const allArticles = useSelector((selector) => selector.loi.articles);
   const allArticlesRelatedToTheContenu =
      allArticles.length &&
      filterArticleToListByContenu(contenuMother.id, allArticles);
   const snapPoints = useMemo(() => [0, '60%', '90%'], []);

   //permission
   if (status === null) {
      requestPermission();
   }

   //all refs
   const bottomSheetRef = useRef(null);
   const imageRef = useRef();

   //all function

   const openBottomSheet = () => {
      return bottomSheetRef.current.present();
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

   // Initialisation des variables pour le titre, le chapitre et la section actuels
   let currentTitre = null;
   let currentChapitre = null;
   let currentSection = null;

   // Fonction pour afficher tous les articles
   const renderArticle = useCallback(
      (article) => {
         // Vérification et affichage du titre
         if (currentTitre !== article.titre_fr) {
            currentTitre = article.titre_fr;
            return (
               <View>
                  <Text style={styles.label_titre}>
                     TITRE N° {article.titre_numero}: {currentTitre}
                  </Text>
                  {langueActual === 'fr' ? (
                     <RenderHtml
                        contentWidth={width}
                        source={sourceHTML(
                           article.contenu_fr?.split('________________')[1]
                        )}
                        tagsStyles={tagsStyles}
                     />
                  ) : (
                     <RenderHtml
                        contentWidth={width}
                        source={sourceHTML(
                           article.contenu_mg?.split('________________')[1] ??
                              article.contenu_fr?.split('________________')[1]
                        )}
                        tagsStyles={tagsStyles}
                     />
                  )}
               </View>
            );
         }

         // Vérification et affichage du chapitre
         if (currentChapitre !== article.chapitre_titre_fr) {
            currentChapitre = article.chapitre_titre_fr;
            return (
               <View>
                  <Text style={styles.label_chapitre}>
                     CHAPITRE N° {article.chapitre_numero}: {currentChapitre}
                  </Text>
                  {langueActual === 'fr' ? (
                     <RenderHtml
                        contentWidth={width}
                        source={sourceHTML(
                           article.contenu_fr?.split('________________')[1]
                        )}
                        tagsStyles={tagsStyles}
                     />
                  ) : (
                     <RenderHtml
                        contentWidth={width}
                        source={sourceHTML(
                           article.contenu_mg?.split('________________')[1] ??
                              article.contenu_fr?.split('________________')[1]
                        )}
                        tagsStyles={tagsStyles}
                     />
                  )}
               </View>
            );
         }

         // Vérification et affichage de la section
         if (currentSection !== article.section_titre_fr) {
            currentSection = article.section_titre_fr;
            return (
               <View>
                  <Text style={styles.label_section}>
                     SECTION: {currentSection}
                  </Text>
                  {
                     <RenderHtml
                        contentWidth={width}
                        source={sourceHTML(
                           article.contenu_fr?.split('________________')[1]
                        )}
                        tagsStyles={tagsStyles}
                     />
                  }
               </View>
            );
         }

         return langueActual === 'fr' ? (
            <RenderHtml
               contentWidth={width}
               source={sourceHTML(
                  article.contenu_fr?.split('________________')[1]
               )}
               tagsStyles={tagsStyles}
            />
         ) : (
            <RenderHtml
               contentWidth={width}
               source={sourceHTML(
                  article.contenu_mg?.split('________________')[1] ??
                     article.contenu_fr?.split('________________')[1]
               )}
               tagsStyles={tagsStyles}
            />
         );
      },
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
                     <View style={styles.titleOfOverview}>
                        <Text
                           style={{
                              fontWeight: 'bold',
                              fontSize: width < 370 ? 18 : 22,
                              textDecorationLine: 'underline',
                              textAlign: 'center',
                              color: Colors.white,
                           }}
                        >
                           {langueActual === 'fr'
                              ? "Vue d'ensemble"
                              : 'Fampisehona ny rehetra'}
                        </Text>
                        <Text style={styles.typeOfContenu}>{`${
                           langueActual === 'fr'
                              ? contenuMother.type_nom_fr
                              : contenuMother.type_nom_fr
                        } ${langueActual === 'fr' ? 'n° ' : 'faha '} ${
                           contenuMother.numero
                        }`}</Text>
                     </View>
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

                     <View
                        style={{
                           flex: 1,
                           paddingRight: 4,
                           marginTop: 18,
                        }}
                     >
                        <FlashList
                           key={'_'}
                           data={allArticlesRelatedToTheContenu}
                           renderItem={({ item }) => renderArticle(item)}
                           keyExtractor={(item) => item.id.toString()}
                           estimatedItemSize={100}
                           getItemLayout={(data, index) => ({
                              length: data.length,
                              offset: data.length * index,
                              index,
                           })}
                           extraData={allArticlesRelatedToTheContenu}
                        />
                     </View>
                  </View>
               </View>
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
