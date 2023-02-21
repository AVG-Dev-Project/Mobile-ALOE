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
import { useFocusEffect } from '@react-navigation/native';
import { filter } from 'lodash';
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

//filter global include search bar / filter by thematique and type
const filterGlobal = (array, theme, type, query) => {
   let res = theme === null && type === null && query === null ? [] : array;

   if (theme) {
      res = res.filter((item) => item.Thematique.nom_Thematique_fr === theme);
   }
   if (type) {
      res = res.filter((_article) => _article.Type.nom_Type_fr === type);
   }
   if (query) {
      res = res.filter((_loi) =>
         _loi.Titre.titre_fr.toLowerCase().includes(query.toLowerCase())
      );
   }

   return res;
};

export default function Recherche({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const [valueForSearch, setValueForSearch] = useState('');
   const allArticles = useSelector((selector) => selector.article.articles);
   const [allArticlesFilter, setAllArticlesFilter] = useState([]);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const allTypes = useSelector((selector) => selector.article.types);
   const allThematiques = useSelector(
      (selector) => selector.article.thematiques
   );
   //data from navigation
   let typeFromParams = route.params ? route.params.type : null;
   let thematiqueFromParams = route.params ? route.params.thematique : null;
   const [typeChecked, setTypeChecked] = useState(null);
   const [thematiqueChecked, setThematiqueChecked] = useState(null);

   console.log(
      'filtre vao e : ',
      typeFromParams + ' / ' + thematiqueFromParams
   );

   //all effect
   useEffect(() => {
      if (typeFromParams || thematiqueFromParams) {
         setTypeChecked(typeFromParams);
         setThematiqueChecked(thematiqueFromParams);
      }
   }, [typeFromParams, thematiqueFromParams]);

   useEffect(() => {
      setAllArticlesFilter(
         filterGlobal(
            allArticles,
            thematiqueChecked,
            typeChecked,
            valueForSearch
         )
      );
   }, [typeChecked, thematiqueChecked, valueForSearch]);

   //necessary when we come back from home page i.e rehefa unmount page
   useFocusEffect(
      useCallback(() => {
         return () => {
            typeFromParams = null;
            thematiqueFromParams = null;
            setAllArticlesFilter([]);
            setTypeChecked(null);
            setThematiqueChecked(null);
         };
      }, [])
   );

   //all function
   /*const findObjectContainValueSearch = (word) => {
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
   };*/

   const onHandleChangeValueSearch = (text) => {
      setValueForSearch(text);
   };

   const filterByType = (text) => {
      setTypeChecked(text);
   };

   const filterByThematique = (text) => {
      setThematiqueChecked(text);
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
                  /*onPress={() => {
                     findObjectContainValueSearch(valueForSearch);
                  }}*/
               >
                  <Text style={styles.boutton_search}>
                     <Icon name={'search'} color={Colors.black} size={40} />
                  </Text>
               </TouchableOpacity>
            </View>

            <View style={styles.view_for_filtre}>
               <View style={styles.view_in_filtre}>
                  <View>
                     <Text
                        style={{
                           textAlign: 'center',
                           fontWeight: 'bold',
                           fontSize: 18,
                           marginTop: 10,
                        }}
                     >
                        {langueActual === 'fr' ? 'Thématique' : 'Lohahevitra'}
                     </Text>
                     {thematiqueChecked !== null && (
                        <Text>{thematiqueChecked}</Text>
                     )}
                  </View>
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
                           {allThematiques.map((type) => (
                              <MenuOption
                                 onSelect={() =>
                                    filterByThematique(
                                       langueActual === 'fr'
                                          ? type.nom?.substring(0, 5)
                                          : type.nom_mg?.substring(0, 5)
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

               <View style={styles.view_in_filtre}>
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
                                    filterByType(
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

                  <View>
                     <Text
                        style={{
                           textAlign: 'center',
                           fontWeight: 'bold',
                           fontSize: 18,
                           marginTop: 10,
                        }}
                     >
                        {langueActual === 'fr' ? 'Type' : 'Karazana'}
                     </Text>
                     {typeChecked !== null && <Text>{typeChecked}</Text>}
                  </View>
               </View>
            </View>
         </View>
         <View style={styles.view_for_result}>
            {allArticlesFilter?.length > 0 && (
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
