import React, { useEffect, useRef, useMemo } from 'react';
import {
   View,
   Text,
   Image,
   SafeAreaView,
   useWindowDimensions,
   StyleSheet,
   TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from '@rneui/themed';
import Carousel from 'react-native-snap-carousel';
import { useSelector, useDispatch } from 'react-redux';
import HeaderGlobal from '_components/header/HeaderGlobal';
import BottomSheetCustom from '_components/bottomSheet/bottomSheet';
import {
   nameStackNavigation as nameNav,
   filterArticleToListByContenu,
   fetchArtiContenuToLocalDatabase,
} from '_utils';
import { styles } from './styles';
import { Colors } from '_theme/Colors';
import {
   getFavoriteFromLocalStorage,
   removeInLocalStorage,
   checkAndsendMailFromLocalDBToAPI,
   ArticleSchema,
   ContenuSchema,
} from '_utils';

export default function Home({ navigation }) {
   //all states
   const dispatch = useDispatch();
   const isCarousel = React.useRef(null);
   const { width, height } = useWindowDimensions();
   const { t } = useTranslation();
   const allArticles = useSelector((selector) => selector.loi.articles);
   const allFavoris = useSelector((selector) => selector.loi.favoris);
   const allContenus = useSelector((selector) => selector.loi.contenus);
   const allTypes = useSelector((selector) => selector.loi.types);
   const allThematiques = useSelector((selector) => selector.loi.thematiques);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isUserNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const isUserConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const snapPoints = useMemo(
      () => (height < 700 ? [0, '60%'] : [0, '50%']),
      []
   );

   const fetchData = () => {
      fetchArtiContenuToLocalDatabase(dispatch, 2);
   };

   const showData = () => {
      return ArticleSchema.query({ columns: '*' }).then((res) => {
         console.log(res.length);
      });
   };

   //all refs
   const bottomSheetRef = useRef(null);

   //all functions

   //all efects
   useEffect(() => {
      bottomSheetRef.current.close();
      //removeInLocalStorage('favorite');
   }, []);

   useEffect(() => {
      if (isUserConnectedToInternet && isUserNetworkActive) {
         checkAndsendMailFromLocalDBToAPI();
      }
   }, [isUserNetworkActive, isUserConnectedToInternet]);

   //all components
   const _renderItemContenu = ({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
               navigation.navigate(nameNav.listArticle, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Loi n° ' : 'Lalana faha '
                  } ${item.numero}`,
                  allArticleRelatedTotheContenu: filterArticleToListByContenu(
                     item.id,
                     allArticles
                  ),
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemArticle}>
               <Image
                  style={styles.image_poster_style_article}
                  source={require('_images/book_loi.jpg')}
               />

               <Text
                  style={{
                     marginVertical: 8,
                     paddingRight: 8,
                     fontWeight: 'bold',
                     fontSize: height < 700 ? 13 : 17,
                  }}
               >
                  {langueActual === 'fr' ? 'Loi n° ' : 'Lalana faha '}
                  {langueActual === 'fr' ? item.numero : item.numero}
               </Text>
               <Text
                  style={{ fontSize: 12, textTransform: 'capitalize' }}
                  numberOfLines={1}
               >
                  {langueActual === 'fr'
                     ? item.objet_contenu_fr
                     : item.objet_contenu_mg}
               </Text>
            </View>
         </TouchableOpacity>
      );
   };

   const _renderItemType = ({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
               navigation.navigate('Recherche', {
                  screen: 'Recherche',
                  type: langueActual === 'fr' ? item.nom_fr : item.nom_mg,
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemType}>
               <Image
                  style={styles.image_poster_style_type}
                  source={require('_images/book_loi.jpg')}
               />
               <View
                  style={[StyleSheet.absoluteFillObject, styles.maskImageCatg]}
               ></View>
               <Text
                  style={[
                     StyleSheet.absoluteFillObject,
                     styles.text_descriptif_for_carousel,
                  ]}
                  numberOfLines={1}
               >
                  {langueActual === 'fr' ? item.nom_fr : item.nom_mg}
               </Text>
            </View>
         </TouchableOpacity>
      );
   };

   const _renderItemThematique = ({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
               navigation.navigate('Recherche', {
                  screen: 'Recherche',
                  thematique: langueActual === 'fr' ? item.nom_fr : item.nom_mg,
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemType}>
               <Image
                  style={styles.image_poster_style_type}
                  source={require('_images/book_loi.jpg')}
               />
               <View
                  style={[StyleSheet.absoluteFillObject, styles.maskImageCatg]}
               ></View>
               <Text
                  style={[
                     StyleSheet.absoluteFillObject,
                     styles.text_descriptif_for_carousel,
                  ]}
                  numberOfLines={2}
               >
                  {langueActual === 'fr' ? item.nom_fr : item.nom_mg}
               </Text>
            </View>
         </TouchableOpacity>
      );
   };

   return (
      <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
         <View style={styles.view_container}>
            <View style={styles.head_content}>
               <HeaderGlobal
                  navigation={navigation}
                  bottomSheetRef={bottomSheetRef}
               />
            </View>

            <View style={styles.landing_screen}>
               <Text style={styles.text_landing_screen}>
                  {t('txt_landing_home')}
               </Text>
               <View style={styles.content_in_landing_screen}>
                  <Image
                     style={styles.icon_in_content_landing}
                     source={require('_images/book_loi.jpg')}
                  />
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                     }}
                  >
                     <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {t('allez_y')}
                     </Text>
                     <Text>{t('continue_de_lire')} </Text>
                  </View>
                  <Icon
                     name={'autorenew'}
                     color={Colors.white}
                     size={38}
                     onPress={() => fetchData()}
                  />
               </View>
            </View>

            <View style={styles.categories}>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginVertical: 25,
                  }}
               >
                  <Text
                     style={{
                        fontSize: height < 700 ? 18 : 22,
                        fontWeight: 'bold',
                     }}
                  >
                     {t('thematique')}
                  </Text>
               </View>
               <View>
                  <SafeAreaView>
                     <View style={styles.view_carousel}>
                        <Carousel
                           layout="default"
                           ref={isCarousel}
                           data={allThematiques}
                           loop={false}
                           loopClonesPerSide={5} //Nombre de clones à ajouter de chaque côté des éléments d'origine. Lors d'un balayage très rapide
                           //fin des props spéficifique au section annonce
                           renderItem={_renderItemThematique}
                           sliderWidth={150}
                           itemWidth={240}
                           inactiveSlideOpacity={0.9} //on uniformise tous les opacity
                           inactiveSlideScale={1} //on uniformise tous les hauteur
                           useScrollView={true}
                        />
                     </View>
                  </SafeAreaView>
               </View>
            </View>

            <View>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginVertical: 25,
                  }}
               >
                  <Text
                     style={{
                        fontSize: height < 700 ? 18 : 22,
                        fontWeight: 'bold',
                     }}
                  >
                     {t('les_types')}
                  </Text>
               </View>
               <View>
                  <SafeAreaView>
                     <View style={styles.view_carousel}>
                        <Carousel
                           layout="default"
                           ref={isCarousel}
                           data={allTypes}
                           loop={false}
                           loopClonesPerSide={5} //Nombre de clones à ajouter de chaque côté des éléments d'origine. Lors d'un balayage très rapide
                           //fin des props spéficifique au section annonce
                           renderItem={_renderItemType}
                           sliderWidth={150}
                           itemWidth={240}
                           inactiveSlideOpacity={0.9} //on uniformise tous les opacity
                           inactiveSlideScale={1} //on uniformise tous les hauteur
                           useScrollView={true}
                        />
                     </View>
                  </SafeAreaView>
               </View>
            </View>

            <View>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginVertical: 25,
                  }}
               >
                  <Text
                     style={{
                        fontSize: height < 700 ? 18 : 22,
                        fontWeight: 'bold',
                     }}
                  >
                     {t('contenu')}
                  </Text>
                  <Icon
                     name={'arrow-forward'}
                     color={Colors.greenAvg}
                     size={30}
                     onPress={() => {
                        navigation.navigate(nameNav.listContenu, {
                           titleScreen:
                              langueActual === 'fr'
                                 ? 'Tous les contenus'
                                 : 'Ireo kaontenu',
                           dataToList: allContenus,
                        });
                     }}
                  />
               </View>
               <View>
                  <SafeAreaView>
                     <View style={styles.view_carousel}>
                        <Carousel
                           layout="default"
                           ref={isCarousel}
                           data={allContenus}
                           loop={true}
                           loopClonesPerSide={5} //Nombre de clones à ajouter de chaque côté des éléments d'origine. Lors d'un balayage très rapide
                           //fin des props spéficifique au section annonce
                           renderItem={_renderItemContenu}
                           sliderWidth={150}
                           itemWidth={240}
                           inactiveSlideOpacity={0.9} //on uniformise tous les opacity
                           inactiveSlideScale={1} //on uniformise tous les hauteur
                           useScrollView={true}
                        />
                     </View>
                  </SafeAreaView>
               </View>
            </View>
         </View>
         <BottomSheetCustom
            bottomSheetRef={bottomSheetRef}
            snapPoints={snapPoints}
         />
      </KeyboardAwareScrollView>
   );
}
