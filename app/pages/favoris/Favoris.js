import {
   View,
   Text,
   FlatList,
   Image,
   useWindowDimensions,
   StyleSheet,
   SafeAreaView,
   ToastAndroid,
   TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import React, {
   useCallback,
   useEffect,
   useState,
   useMemo,
   useRef,
} from 'react';
import {
   nameStackNavigation as nameNav,
   checkAndsendMailFromLocalDBToAPI,
} from '_utils';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import HeaderGlobal from '_components/header/HeaderGlobal';
import BottomSheetCustom from '_components/bottomSheet/bottomSheet';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function Favoris({ navigation, route }) {
   const listOfIdFavorites = useSelector((selector) => selector.loi.favoris);
   const allArticles = useSelector((selector) => selector.loi.articles);
   const dispatch = useDispatch();
   const { width, height } = useWindowDimensions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isUserNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const isUserConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const allContenus = useSelector((selector) => selector.loi.contenus);

   const snapPoints = useMemo(
      () => (height < 700 ? [0, '40%'] : [0, '28%']),
      []
   );
   const dataForFlatList = allArticles.filter((article) =>
      listOfIdFavorites.includes(article.id)
   );

   //all functions
   const getOneContenuReferenceByIdFromArticle = (idCont) => {
      const referenceContenu = allContenus.filter(
         (contenu) => contenu.id === idCont
      );
      return referenceContenu[0];
   };

   //all refs
   const bottomSheetRef = useRef(null);

   //all components
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.detailPage, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Article n°' : 'Lahatsoratra '
                  } ${item.numero}`,
                  articleToViewDetail: item,
               });
            }}
         >
            <View style={styles.view_render}>
               <Image
                  source={require('_images/abstract.jpg')}
                  style={{
                     width: width < 380 ? 100 : 140,
                     height: 170,
                     borderRadius: 16,
                  }}
               />
               <View
                  style={[
                     StyleSheet.absoluteFillObject,
                     styles.maskImageArticle,
                  ]}
               ></View>
               <Text
                  style={[
                     StyleSheet.absoluteFillObject,
                     styles.number_of_article,
                  ]}
               >
                  {item.numero}
               </Text>
               <View
                  style={{
                     marginLeft: 12,
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                  }}
               >
                  <View>
                     <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {getOneContenuReferenceByIdFromArticle(item.contenu)
                           .type_nom_fr +
                           ' ' +
                           getOneContenuReferenceByIdFromArticle(item.contenu)
                              .numero}
                     </Text>
                     <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {langueActual === 'fr' ? 'Article n°' : 'Lahatsoratra '}{' '}
                        {item.numero}
                     </Text>
                     <Text
                        style={{
                           fontSize: width < 370 ? 10 : 14,
                           textDecorationLine: 'underline',
                        }}
                        numberOfLines={1}
                     >
                        {langueActual === 'fr' ? item.titre_fr : item.titre_mg}
                     </Text>
                  </View>
                  <Text
                     style={{
                        fontSize: width < 380 ? 10 : 16,
                        flex: 2,
                        width: 210,
                        marginTop: 8,
                     }}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr'
                        ? item.contenu_fr?.split('________________')[0]
                        : item.contenu_mg?.split('________________')[0] ??
                          'Tsy misy dikan-teny malagasy ito lahatsoratra iray ito.'}
                     {' ...'}
                  </Text>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                     }}
                  >
                     <View
                        style={{
                           display: 'flex',
                           flexDirection: 'row',
                           alignItems: 'center',
                        }}
                     >
                        <Icon
                           name={'sentiment-very-satisfied'}
                           color={Colors.greenAvg}
                           size={18}
                        />
                        <Text
                           style={{
                              fontSize: 14,
                              marginLeft: 2,
                           }}
                        >
                           {langueActual === 'fr' ? 'Favoris' : 'Ankafizina'}
                        </Text>
                     </View>
                     <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                           dispatch(addFavoris(item.id));
                           showToastFavorite(item.numero);
                        }}
                     >
                        <Icon
                           name={'favorite'}
                           color={Colors.redError}
                           size={28}
                        />
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      );
   }, []);

   //all function
   const showToastFavorite = (id) => {
      ToastAndroid.show(
         `Vous avez enlevé l'article n° ${id} dans votre favoris`,
         ToastAndroid.SHORT
      );
   };

   //all effects
   useEffect(() => {
      if (isUserConnectedToInternet && isUserNetworkActive) {
         checkAndsendMailFromLocalDBToAPI();
      }
   }, [isUserNetworkActive, isUserConnectedToInternet]);

   const _idKeyExtractor = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   return (
      <View style={styles.view_container}>
         <SafeAreaView>
            <FlatList
               ListHeaderComponent={
                  <View>
                     <View style={styles.head_content}>
                        <HeaderGlobal
                           navigation={navigation}
                           bottomSheetRef={bottomSheetRef}
                        />
                     </View>

                     <View style={styles.landing_screen}>
                        <Text style={styles.text_landing_screen}>
                           {langueActual === 'fr'
                              ? 'Vos favoris'
                              : 'Ireo ankafizinao'}
                        </Text>
                        <View style={styles.content_in_landing_screen}>
                           <Image
                              style={styles.icon_in_content_landing}
                              source={require('_images/abstract_3.jpg')}
                           />
                           <View
                              style={{
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'flex-start',
                              }}
                           >
                              <Text
                                 style={{ fontSize: 16, fontWeight: 'bold' }}
                              >
                                 {langueActual === 'fr'
                                    ? 'Favoris'
                                    : 'Ankafizina'}
                              </Text>
                              <Text>
                                 {langueActual === 'fr'
                                    ? 'Regardez-les encore'
                                    : 'Jereo ihany izy ireo'}{' '}
                              </Text>
                           </View>
                           <Icon
                              name={'favorite'}
                              color={Colors.redError}
                              size={38}
                           />
                        </View>
                     </View>
                  </View>
               }
               ListEmptyComponent={
                  <View
                     style={{
                        display: 'flex',
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: Colors.redError,
                        padding: 18,
                        marginVertical: width < 370 ? 20 : 28,
                     }}
                  >
                     <Text
                        style={{
                           textAlign: 'center',
                           color: Colors.redError,
                           fontSize: width < 370 ? 18 : 30,
                        }}
                     >
                        {langueActual === 'fr'
                           ? "Vous n'avez pas de favoris"
                           : 'Tsy misy ny ankafizinao'}
                     </Text>
                  </View>
               }
               data={dataForFlatList}
               key={'_'}
               keyExtractor={_idKeyExtractor}
               renderItem={_renderItem}
               removeClippedSubviews={true}
               getItemLayout={(data, index) => ({
                  length: data.length,
                  offset: data.length * index,
                  index,
               })}
               initialNumToRender={5}
               maxToRenderPerBatch={3}
            />
         </SafeAreaView>
         <BottomSheetCustom
            bottomSheetRef={bottomSheetRef}
            snapPoints={snapPoints}
         />
      </View>
   );
}
