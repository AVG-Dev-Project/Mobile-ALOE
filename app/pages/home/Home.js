import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   Image,
   SafeAreaView,
   TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from '@rneui/themed';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';

import HeaderGlobal from '_components/header/HeaderGlobal';
import { nameStackNavigation as nameNav } from '_utils';
import { styles } from './styles';
import { Colors } from '_theme/Colors';

export default function Home({ navigation }) {
   //all states
   const isCarousel = React.useRef(null);
   const allArticles = useSelector((selector) => selector.article.articles);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const allThematiques = useSelector(
      (selector) => selector.article.thematiques
   );

   //all efects
   const { t } = useTranslation();

   //all components
   const _renderItemArticle = ({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
               navigation.navigate(nameNav.detailPage, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Article n° ' : 'Lahatsoratra '
                  } ${item.Article.numero_Article}`,
                  articleToViewDetail: item,
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemArticle}>
               <Image
                  style={styles.image_poster_style}
                  source={item.photo ?? require('_images/book_loi.jpg')}
               />
               <Text
                  style={{
                     marginVertical: 8,
                     paddingRight: 8,
                     fontWeight: 'bold',
                     fontSize: 17,
                  }}
                  numberOfLines={1}
               >
                  {langueActual === 'fr'
                     ? item.Titre?.titre_fr
                     : item.Titre?.titre_mg}
               </Text>
               <Text style={{ fontSize: 12 }}>
                  {t('mot_publie_home')}:{item.date_created?.substring(0, 10)}{' '}
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
                  type: item.Type.nom_Type_fr,
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemType}>
               <Image
                  style={styles.image_poster_style_type}
                  source={item.photo ?? require('_images/book_loi.jpg')}
               />
               <Text
                  style={{
                     marginVertical: 8,
                     fontSize: 16,
                  }}
                  numberOfLines={2}
               >
                  {/*langueActual === 'fr'
                     ? item.Titre?.titre_fr
               : item.Titre?.titre_mg*/}
                  {item.Type.nom_Type_fr}
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
                  thematique: item.Thematique.nom_Thematique_fr,
               });
            }}
         >
            <View key={item.id} style={styles.view_container_renderItemType}>
               <Image
                  style={styles.image_poster_style_type}
                  source={item.photo ?? require('_images/book_loi.jpg')}
               />
               <Text
                  style={{
                     marginVertical: 8,
                     fontSize: 16,
                  }}
                  numberOfLines={2}
               >
                  {/*langueActual === 'fr'
                     ? item.Titre?.titre_fr
               : item.Titre?.titre_mg*/}
                  {item.Thematique.nom_Thematique_fr}
               </Text>
            </View>
         </TouchableOpacity>
      );
   };

   return (
      <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
         <View style={styles.view_container}>
            <View style={styles.head_content}>
               <HeaderGlobal navigation={navigation} />
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
                  <Icon name={'autorenew'} color={Colors.white} size={38} />
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
                  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                     {t('thematique')}
                  </Text>
               </View>
               <View>
                  <SafeAreaView>
                     <View style={styles.view_carousel}>
                        <Carousel
                           layout="default"
                           ref={isCarousel}
                           data={allArticles}
                           loop={true}
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
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                     {t('les_types')}
                  </Text>
               </View>
               <View>
                  <SafeAreaView>
                     <View style={styles.view_carousel}>
                        <Carousel
                           layout="default"
                           ref={isCarousel}
                           data={allArticles}
                           loop={true}
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
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                     {t('publie_recemment')}
                  </Text>
                  <Icon
                     name={'arrow-forward'}
                     color={Colors.violet}
                     size={30}
                     onPress={() => {
                        navigation.navigate(nameNav.listPage, {
                           titleScreen:
                              langueActual === 'fr'
                                 ? 'Tous les articles'
                                 : 'Ireo lahatsoratra',
                           dataToList: allArticles,
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
                           data={allArticles}
                           loop={true}
                           loopClonesPerSide={5} //Nombre de clones à ajouter de chaque côté des éléments d'origine. Lors d'un balayage très rapide
                           //fin des props spéficifique au section annonce
                           renderItem={_renderItemArticle}
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
      </KeyboardAwareScrollView>
   );
}
