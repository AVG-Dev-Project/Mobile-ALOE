import {
   View,
   Text,
   FlatList,
   Image,
   SafeAreaView,
   Dimensions,
   TextInput,
   TouchableOpacity,
} from 'react-native';
import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
} from 'react-native-popup-menu';
import React, { useCallback, useEffect, useState } from 'react';
import { styles } from './styles';
import { nameStackNavigation as nameNav } from '_utils/constante/NameStackNavigation';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '_theme/Colors';
import { addFavoris } from '_utils/redux/actions/action_creators';

//component custom
const MenuOptionCustom = ({ text }) => {
   return (
      <View
         style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingVertical: 4,
         }}
      >
         <Icon name={'category'} color={Colors.black} size={18} />
         <Text style={{ fontSize: 22, marginLeft: 8 }}>
            {text?.substring(0, 16)}
         </Text>
      </View>
   );
};

export default function Recherche({ navigation }) {
   //all data
   const dispatch = useDispatch();
   const [valueForSearch, setValueForSearch] = useState('');
   const allArticles = useSelector((selector) => selector.article.articles);
   const [allArticlesFilter, setAllArticlesFilter] = useState([]);
   const allTypes = useSelector((selector) => selector.article.types);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );

   //all function
   const findObjectContainValueSearch = (word) => {
      if (word !== '') {
         if (langueActual === 'fr') {
            let resultSearch = allArticles.filter(
               (item) =>
                  item.Titre.titre_fr
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Article.contenu_Article_fr
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Intutile.contenu_intutile
                     .toLowerCase()
                     .includes(word.toLowerCase())
            );
            setAllArticlesFilter(resultSearch);
         } else {
            let resultSearch = allArticles.filter(
               (item) =>
                  item.Titre.titre_mg
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Article.contenu_Article_mg
                     .toLowerCase()
                     .includes(word.toLowerCase()) ||
                  item.Intutile.contenu_intutile
                     .toLowerCase()
                     .includes(word.toLowerCase())
            );
            setAllArticlesFilter(resultSearch);
         }
      } else {
         setAllArticlesFilter([]);
      }
   };

   const onHandleChangeValueSearch = (text) => {
      setValueForSearch(text);
   };

   const filterResultByType = (text) => {
      if (langueActual === 'fr') {
         let resultFilter = allArticlesFilter.filter(
            (item) =>
               item.Type.nom_Type_fr.toLowerCase() === text.toLowerCase() ??
               valueForSearch.toLowerCase()
         );
         setAllArticlesFilter(resultFilter);
      } else {
         let resultFilter = allArticlesFilter.filter(
            (item) =>
               item.Type.nom_Type_mg.toLowerCase() === text.toLowerCase() ??
               valueForSearch.toLowerCase()
         );
         setAllArticlesFilter(resultFilter);
      }
   };

   //all render
   const _renderItem = useCallback(({ item }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               navigation.navigate(nameNav.detailPage, {
                  titleScreen: `Article n° ${item.id}`,
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
                        {langueActual === 'fr' ? 'Article' : 'Lahatsoratra'} n°{' '}
                        {item.Article.numero_Article}
                     </Text>
                     <Text style={{ fontSize: 12, marginBottom: 8 }}>
                        {langueActual === 'fr' ? 'Publié le ' : 'Navoaka ny '} :{' '}
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
                           name={'sentiment-very-dissatisfied'}
                           color={Colors.orange}
                           size={18}
                        />
                        <Text
                           style={{
                              fontSize: 14,
                              marginLeft: 2,
                           }}
                        >
                           {langueActual === 'fr'
                              ? 'Pas encore lu'
                              : 'Tsy voavaky'}
                        </Text>
                     </View>
                     <View
                        style={{
                           display: 'flex',
                           flexDirection: 'row',
                           width:
                              Dimensions.get('window').height < 700 ? 90 : 108,
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
                              name={'favorite-border'}
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
      <View style={styles.view_container_search}>
         <View style={styles.head_content}>
            <View
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
               }}
            >
               <TouchableOpacity activeOpacity={0.7}>
                  <Icon name={'mic'} color={Colors.violet} size={30} />
                  <Text style={{ fontWeight: 'bold' }}>
                     {langueActual === 'fr'
                        ? 'Recherche vocale'
                        : "Hitady amin'ny alalan'ny feo"}{' '}
                  </Text>
               </TouchableOpacity>
            </View>

            <View style={styles.view_for_input_search}>
               <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  placeholder={
                     langueActual === 'fr'
                        ? 'Entrer le mot de recherche ...'
                        : 'Ampidiro ny teny hotadiavina...'
                  }
                  value={valueForSearch}
                  onChangeText={(text) => onHandleChangeValueSearch(text)}
               />
               <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                     findObjectContainValueSearch(valueForSearch);
                  }}
               >
                  <Text style={styles.boutton_search}>
                     <Icon name={'search'} color={Colors.black} size={40} />
                  </Text>
               </TouchableOpacity>
            </View>

            <View style={styles.view_for_filtre}>
               <Text
                  style={{
                     textAlign: 'center',
                     fontWeight: 'bold',
                     fontSize: 18,
                  }}
               >
                  {langueActual === 'fr' ? 'Filtre' : 'Sivana'}
               </Text>
               <TouchableOpacity activeOpacity={0.8}>
                  <Menu>
                     <MenuTrigger customStyles={{}}>
                        <Icon
                           name={'filter-list'}
                           color={Colors.violet}
                           size={34}
                        />
                     </MenuTrigger>
                     <MenuOptions
                        customStyles={{
                           optionsContainer: {
                              padding: 8,
                           },
                           optionText: {
                              fontSize: 22,
                           },
                        }}
                     >
                        {allTypes.map((type) => (
                           <MenuOption
                              onSelect={() =>
                                 filterResultByType(
                                    langueActual === 'fr'
                                       ? type.nom
                                       : type.nom_mg
                                 )
                              }
                              key={type.id}
                           >
                              <MenuOptionCustom
                                 text={
                                    langueActual === 'fr'
                                       ? type.nom
                                       : type.nom_mg
                                 }
                              />
                           </MenuOption>
                        ))}
                     </MenuOptions>
                  </Menu>
               </TouchableOpacity>
            </View>
         </View>
         <View style={styles.view_for_result}>
            {allArticlesFilter.length > 0 && (
               <Text style={{ textAlign: 'center' }}>
                  {allArticlesFilter.length}{' '}
                  {langueActual === 'fr'
                     ? ' résultats trouvés'
                     : ' ny valiny hita'}
               </Text>
            )}
            <SafeAreaView style={styles.container_safe}>
               <FlatList
                  data={allArticlesFilter}
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
         </View>
      </View>
   );
}
