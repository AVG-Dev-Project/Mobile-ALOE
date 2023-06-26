import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
   View,
   Text,
   Image,
   SafeAreaView,
   ActivityIndicator,
   useWindowDimensions,
   ScrollView,
   ToastAndroid,
   ImageBackground,
   TouchableOpacity,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { Icon } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import BottomSheetCustom from '_components/bottomSheet/bottomSheet';
import { styles } from './styles';
import bgImageThematique from '_images/thematique.jpg';
import { Colors } from '_theme/Colors';
import { dataForStatistique } from '_utils/redux/actions/action_creators';
import {
   nameStackNavigation as nameNav,
   fetchPartialDataForUpdating,
   checkAndsendMailFromLocalDBToAPI,
   fetchTypesToApi,
   fetchTagsToApi,
   fetchThematiquesToApi,
   storeStatistiqueToLocalStorage,
   getDataFromLocalStorage,
   widthPercentageToDP,
} from '_utils';

export default function Home({ navigation }) {
   //all states
   const dispatch = useDispatch();
   const { height } = useWindowDimensions();
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

   //all functions

   const fetchStatistique = () => {
      getDataFromLocalStorage('articleTotalInServ').then((res) => {
         dispatch(dataForStatistique({ statsFor: 'article', value: res ?? 0 }));
      });
      getDataFromLocalStorage('contenuTotalInServ').then((res) => {
         dispatch(dataForStatistique({ statsFor: 'contenu', value: res ?? 0 }));
      });
   };

   const openBottomSheet = () => {
      return bottomSheetRef.current?.present();
   };

   const updatingPartialData = async () => {
      await storeStatistiqueToLocalStorage();
      let resType = await fetchTypesToApi();
      let resTag = await fetchTagsToApi();
      let resTheme = await fetchThematiquesToApi();
      fetchPartialDataForUpdating(dispatch);
      fetchStatistique();
      if (
         resType.results?.length > 0 &&
         resTag.results?.length > 0 &&
         resTheme.results?.length > 0
      ) {
         ToastAndroid.show(
            langueActual === 'fr'
               ? "Contenu de l'application mis à jour."
               : "Votoatin'ny application nohavaozina.",
            ToastAndroid.SHORT
         );
      } else {
         ToastAndroid.show(
            langueActual === 'fr'
               ? "Certains contenu ne sont pas disponible et n'ont pas été mis à jour."
               : "Misy votoatin'ny application maromaro tsy nohavaozina noho ny tsy fisian'izy ireo.",
            ToastAndroid.SHORT
         );
      }
      setIsFetchData(false);
   };

   //all refs
   const bottomSheetRef = useRef(null);

   //all efects
   useEffect(() => {
      if (isUserConnectedToInternet && isUserNetworkActive) {
         checkAndsendMailFromLocalDBToAPI();
      }
   }, [isUserNetworkActive, isUserConnectedToInternet]);

   //all keys
   const _idKeyExtractorThematique = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   const _idKeyExtractorContenu = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   //all components
   const _renderItemContenu = ({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
               navigation.navigate(nameNav.listArticle, {
                  titleScreen: `${
                     langueActual === 'fr'
                        ? `${item.type_nom_fr} n° `
                        : `${item.type_nom_mg} faha `
                  } ${item.numero}`,
                  contenuMother: item,
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemArticle}>
               <Image
                  style={styles.image_poster_style_article}
                  source={require('_images/contenu.jpg')}
                  blurRadius={2}
               />

               <Text
                  style={{
                     marginTop: 8,
                     paddingRight: 8,
                     fontWeight: 'bold',
                     fontSize: height < 700 ? 13 : 17,
                  }}
               >
                  {langueActual === 'fr'
                     ? `${item.type_nom_fr} n° `
                     : `${item.type_nom_mg ?? item.type_nom_fr} faha `}
                  {langueActual === 'fr' ? item.numero : item.numero}
               </Text>
               <Text style={{ fontSize: 12, width: 220 }} numberOfLines={1}>
                  {langueActual === 'fr'
                     ? item.objet_contenu_fr
                     : item.objet_contenu_mg ?? item.objet_contenu_fr}
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
                  thematique:
                     langueActual === 'fr'
                        ? item.nom_fr
                        : item.nom_mg ?? item.nom_fr,
               });
            }}
         >
            <ImageBackground
               source={bgImageThematique}
               blurRadius={5}
               style={{
                  marginHorizontal: 4,
                  height: 130,
                  width: 230,
               }}
               imageStyle={{
                  resizeMode: 'cover',
                  borderRadius: 18,
               }}
            >
               <View
                  key={item.id}
                  style={styles.view_container_renderItemThematique}
               >
                  <Text
                     style={styles.text_descriptif_for_carousel}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr'
                        ? item.nom_fr
                        : item.nom_mg ?? item.nom_fr}
                  </Text>
               </View>
            </ImageBackground>
         </TouchableOpacity>
      );
   };

   return (
      <ScrollView style={{ backgroundColor: Colors.background }}>
         <View style={styles.view_container}>
            <View style={styles.container_header}>
               <Text style={styles.titre_salutation}>
                  {t('bienvenue_header_text')}
               </Text>
               <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => openBottomSheet()}
               >
                  <Image
                     style={styles.flagImg}
                     source={
                        langueActual === 'fr'
                           ? require('_images/french.png')
                           : require('_images/malagasy.png')
                     }
                  />
               </TouchableOpacity>
            </View>

            <View style={styles.landing_screen}>
               <Text style={styles.text_landing_screen}>
                  {t('txt_landing_home')}
               </Text>
               <View style={styles.content_in_landing_screen}>
                  <Image
                     style={styles.icon_in_content_landing}
                     source={require('_images/contenu.jpg')}
                  />
                  <Text
                     style={{
                        fontSize: widthPercentageToDP(3.5),
                        fontWeight: 'bold',
                     }}
                  >
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
                        <FlashList
                           horizontal={true}
                           showHorizontalScrollIndicator={false}
                           data={allThematiques}
                           extraData={langueActual}
                           key={'_'}
                           keyExtractor={_idKeyExtractorThematique}
                           renderItem={_renderItemThematique}
                           estimatedItemSize={20}
                           getItemLayout={(data, index) => ({
                              length: data.length,
                              offset: data.length * index,
                              index,
                           })}
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
                        <FlashList
                           horizontal={true}
                           showHorizontalScrollIndicator={false}
                           data={allContenus}
                           extraData={langueActual}
                           key={'_'}
                           keyExtractor={_idKeyExtractorContenu}
                           renderItem={_renderItemContenu}
                           estimatedItemSize={20}
                           getItemLayout={(data, index) => ({
                              length: data.length,
                              offset: data.length * index,
                              index,
                           })}
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
      </ScrollView>
   );
}
