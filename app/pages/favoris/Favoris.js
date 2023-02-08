import {
   View,
   Text,
   FlatList,
   Image,
   SafeAreaView,
   TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { nameStackNavigation as nameNav } from '_utils/constante/NameStackNavigation';
import { styles } from './styles';
import { Icon } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import HeaderGlobal from '_components/header/HeaderGlobal';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

export default function Favoris({ navigation, route }) {
   const dataForFlatList = useSelector((selector) => selector.article.favoris);
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   //all logics
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.detailPage, {
                  titleScreen: `${
                     langueActual === 'fr'
                        ? 'Article n° '
                        : 'Lahatsoratra faha '
                  } ${item.Article.numero_Article}`,
                  articleToViewDetail: item,
               });
            }}
         >
            <View style={styles.view_render}>
               <Image
                  source={item.photo ?? require('_images/book_loi.jpg')}
                  style={{ width: 130, height: 150, borderRadius: 16 }}
               />
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
                        {item.id}
                     </Text>
                     <Text style={{ fontSize: 12, marginBottom: 8 }}>
                        {langueActual === 'fr' ? 'Publié le ' : 'Nivoaka ny '} :{' '}
                        {item.date_created?.substring(0, 10)}
                     </Text>
                  </View>
                  <Text
                     style={{ fontSize: 16, flex: 2, width: 210 }}
                     numberOfLines={4}
                  >
                     {langueActual === 'fr'
                        ? item.Article.contenu_Article_fr
                        : item.Article.contenu_Article_mg}{' '}
                  </Text>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: 140,
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
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
                           name={'sentiment-satisfied-alt'}
                           color="green"
                           size={18}
                        />
                        <Text
                           style={{
                              fontSize: 14,
                              marginLeft: 2,
                           }}
                        >
                           {langueActual === 'fr' ? 'Déjà lu' : 'Efa voavaky'}
                        </Text>
                     </View>
                     <View
                        style={{
                           display: 'flex',
                           flexDirection: 'row',
                           width: 108,
                           justifyContent: 'space-evenly',
                        }}
                     >
                        <TouchableOpacity
                           activeOpacity={0.8}
                           onPress={() => {
                              alert('PDF');
                           }}
                        >
                           <Icon
                              name={'picture-as-pdf'}
                              color={Colors.violet}
                              size={28}
                           />
                        </TouchableOpacity>
                        <TouchableOpacity
                           activeOpacity={0.8}
                           onPress={() => {
                              dispatch(addFavoris(item));
                           }}
                        >
                           <Icon
                              name={'favorite'}
                              color={Colors.orange}
                              size={28}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      );
   }, []);

   const _idKeyExtractor = (item, index) =>
      item?.id == null ? index.toString() : item.id.toString();

   return (
      <View style={styles.view_container}>
         <SafeAreaView>
            {dataForFlatList.length > 0 ? (
               <FlatList
                  ListHeaderComponent={
                     <View>
                        <View style={styles.head_content}>
                           <HeaderGlobal navigation={navigation} />
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
            ) : (
               <View>
                  <View>
                     <View style={styles.head_content}>
                        <HeaderGlobal navigation={navigation} />
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
                  <View
                     style={{
                        display: 'flex',
                        borderWidth: 1,
                        padding: 18,
                        marginVertical: 28,
                     }}
                  >
                     <Text style={{ textAlign: 'center', fontSize: 32 }}>
                        {langueActual === 'fr'
                           ? 'Pas de favoris'
                           : 'Tsy misy ankafizina'}
                     </Text>
                  </View>
               </View>
            )}
         </SafeAreaView>
      </View>
   );
}
