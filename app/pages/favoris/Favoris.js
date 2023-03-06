import {
   View,
   Text,
   FlatList,
   Image,
   Dimensions,
   useWindowDimensions,
   StyleSheet,
   SafeAreaView,
   TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { nameStackNavigation as nameNav, cutTextWithBalise } from '_utils';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import HeaderGlobal from '_components/header/HeaderGlobal';
import BottomSheetCustom from '_components/bottomSheet/bottomSheet';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function Favoris({ navigation, route }) {
   const dataForFlatList = useSelector((selector) => selector.loi.favoris);
   const dispatch = useDispatch();
   const { width } = useWindowDimensions();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );

   //all refs
   const bottomSheetRef = useRef(null);

   //all logics
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
                  source={require('_images/book_loi.jpg')}
                  style={{
                     width: Dimensions.get('window').width < 380 ? 100 : 120,
                     height: 160,
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
                        {langueActual === 'fr' ? 'Article n°' : 'Lahatsoratra '}{' '}
                        {item.numero}
                     </Text>
                     <Text
                        style={{
                           fontSize:
                              Dimensions.get('window').width < 370 ? 10 : 14,
                           textDecorationLine: 'underline',
                        }}
                        numberOfLines={1}
                     >
                        {langueActual === 'fr' ? item.titre_fr : item.titre_mg}
                     </Text>
                     {item.chapitre_id && (
                        <Text style={{ fontSize: 12 }}>
                           {langueActual === 'fr'
                              ? `Chapitre ${item.chapitre_numero ?? ''}`
                              : `Lohateny ${item.chapitre_numero ?? ''}`}
                           : {item.chapitre_titre_fr ?? ''}
                        </Text>
                     )}
                  </View>
                  <Text
                     style={{
                        fontSize: Dimensions.get('window').width < 380 ? 8 : 16,
                        flex: 2,
                        width: 210,
                     }}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr' ? (
                        <RenderHtml
                           contentWidth={width}
                           source={sourceHTML(
                              cutTextWithBalise(item.contenu_fr, 700)
                           )}
                           tagsStyles={tagsStyles}
                        />
                     ) : (
                        <RenderHtml
                           contentWidth={width}
                           source={sourceHTML(
                              cutTextWithBalise(item.contenu_mg, 700)
                           )}
                           tagsStyles={tagsStyles}
                        />
                     )}
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
                           dispatch(addFavoris(item));
                           alert(
                              langueActual === 'fr'
                                 ? 'Enlever au favoris.'
                                 : "Esorina ato amin'ny ankafizina"
                           );
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
   const sourceHTML = (data) => {
      const source = {
         html: data,
      };
      return source;
   };

   const tagsStyles = {
      p: {
         width: '40%',
         fontSize: Dimensions.get('window').width < 370 ? 12 : 18,
      },
   };

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
                              source={require('_images/book_loi.jpg')}
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
                              name={'autorenew'}
                              color={Colors.white}
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
         <BottomSheetCustom bottomSheetRef={bottomSheetRef} />
      </View>
   );
}
