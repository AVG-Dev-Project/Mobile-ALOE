import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
   View,
   Text,
   Image,
   SafeAreaView,
   ActivityIndicator,
   useWindowDimensions,
   ToastAndroid,
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
   fetchPartialDataForUpdating,
} from '_utils';
import { styles } from './styles';
import { Colors } from '_theme/Colors';
import {
   getFavoriteFromLocalStorage,
   removeInLocalStorage,
   checkAndsendMailFromLocalDBToAPI,
   ArticleSchema,
   ContenuSchema,
   fetchTypesToApi,
   fetchTagsToApi,
   fetchThematiquesToApi,
} from '_utils';

export default function Home({ navigation }) {
   //all states
   const dispatch = useDispatch();
   const isCarousel = React.useRef(null);
   const { width, height } = useWindowDimensions();
   const { t } = useTranslation();
   const allContenus = useSelector((selector) => selector.loi.contenus);
   const allThematiques = useSelector((selector) => selector.loi.thematiques);
   const [isFetchData, setIsFetchData] = useState(false);
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

   const updatingPartialData = async () => {
      await fetchTypesToApi();
      await fetchTagsToApi();
      await fetchThematiquesToApi();
      fetchPartialDataForUpdating(dispatch);
      ToastAndroid.show(
         langueActual === 'fr'
            ? "Contenu de l'application mis à jour."
            : "Votoatin'ny application nohavaozina."
      );
      setIsFetchData(false);
   };

   //all refs
   const bottomSheetRef = useRef(null);

   //all functions

   //all efects

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
                     langueActual === 'fr' ? 'Loi n°' : 'Lalana faha '
                  } ${item.numero}`,
                  idOfThisContenu: item.id,
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemArticle}>
               <Image
                  style={styles.image_poster_style_article}
                  source={require('_images/abstract_3.jpg')}
               />

               <Text
                  style={{
                     marginTop: 8,
                     paddingRight: 8,
                     fontWeight: 'bold',
                     fontSize: height < 700 ? 13 : 17,
                  }}
               >
                  {langueActual === 'fr' ? 'Loi n° ' : 'Lalana faha '}
                  {langueActual === 'fr' ? item.numero : item.numero}
               </Text>
               <Text style={{ fontSize: 12 }} numberOfLines={1}>
                  {langueActual === 'fr'
                     ? item.objet_contenu_fr
                     : item.objet_contenu_mg ?? 'Tsy misy dikan-teny malagasy.'}
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
            <View
               key={item.id}
               style={styles.view_container_renderItemThematique}
            >
               <View
                  style={[StyleSheet.absoluteFillObject, styles.maskImageCatg]}
               ></View>
               <Text
                  style={[styles.text_descriptif_for_carousel]}
                  numberOfLines={4}
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
                     source={require('_images/abstract_3.jpg')}
                  />
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                     {t('renseignez')}
                  </Text>
                  {isFetchData ? (
                     <ActivityIndicator size="large" color={Colors.greenAvg} />
                  ) : (
                     <Icon
                        name={'autorenew'}
                        color={Colors.white}
                        size={38}
                        onPress={() => {
                           setIsFetchData(true);
                           updatingPartialData();
                        }}
                     />
                  )}
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
                                 : 'Ireo votoantiny rehetra',
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
