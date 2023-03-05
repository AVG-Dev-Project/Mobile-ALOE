import {
   View,
   Text,
   FlatList,
   SafeAreaView,
   Dimensions,
   TextInput,
   TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
} from 'react-native-popup-menu';
import React, { useCallback, useEffect, useState } from 'react';
import { styles } from './styles';
import {
   nameStackNavigation as nameNav,
   filterArticleToListByContenu,
} from '_utils';
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
      res = res.filter((_contenu) => _contenu.thematique_nom_fr === theme);
   }
   if (type) {
      res = res.filter((_contenu) => _contenu.type_nom_fr === type);
   }
   if (query) {
      res = res.filter((_loi) =>
         _loi.objet_contenu_fr.toLowerCase().includes(query.toLowerCase())
      );
   }

   return res;
};

export default function Recherche({ navigation, route }) {
   //all data
   const dispatch = useDispatch();
   const [valueForSearch, setValueForSearch] = useState('');
   const widthDevice = Dimensions.get('window').width;
   const allArticles = useSelector((selector) => selector.loi.articles);
   const allContenus = useSelector((selector) => selector.loi.contenus);
   const [allContenusFilter, setAllContenusFilter] = useState([]);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const allTypes = useSelector((selector) => selector.loi.types);
   const allThematiques = useSelector((selector) => selector.loi.thematiques);
   //data from navigation
   let typeFromParams = route.params ? route.params.type : null;
   let thematiqueFromParams = route.params ? route.params.thematique : null;
   const [typeChecked, setTypeChecked] = useState(null);
   const [thematiqueChecked, setThematiqueChecked] = useState(null);

   //all effect
   useEffect(() => {
      if (typeFromParams || thematiqueFromParams) {
         setTypeChecked(typeFromParams);
         setThematiqueChecked(thematiqueFromParams);
      }
   }, [typeFromParams, thematiqueFromParams]);

   useEffect(() => {
      if (typeChecked || thematiqueChecked || valueForSearch) {
         setAllContenusFilter(
            filterGlobal(
               allContenus,
               thematiqueChecked,
               typeChecked,
               valueForSearch
            )
         );
      } else {
         setAllContenusFilter([]);
      }
   }, [typeChecked, thematiqueChecked, valueForSearch]);

   //necessary when we come back from home page i.e rehefa unmount page
   useFocusEffect(
      useCallback(() => {
         return () => {
            typeFromParams = null;
            thematiqueFromParams = null;
            setAllContenusFilter([]);
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
            setAllContenusFilter(resultSearch);
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
            setAllContenusFilter(resultSearch);
         }
      } else {
         setAllContenusFilter([]);
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
               navigation.navigate(nameNav.listArticle, {
                  titleScreen: `${
                     langueActual === 'fr' ? 'Loi n°' : 'Lalana faha '
                  } ${item.numero}`,
                  allArticleRelatedTotheContenu: filterArticleToListByContenu(
                     item.id,
                     allArticles
                  ),
               });
            }}
         >
            <View style={styles.view_render}>
               <View>
                  <Text
                     style={{
                        fontWeight: 'bold',
                        fontSize: widthDevice < 370 ? 15 : 18,
                     }}
                  >
                     {langueActual === 'fr' ? 'Loi n°' : 'Lalana faha '}{' '}
                     {item.numero}
                  </Text>
                  <Text
                     style={{
                        fontSize: widthDevice < 370 ? 9 : 12,
                        marginBottom: 8,
                        textDecorationLine: 'underline',
                     }}
                  >
                     {langueActual === 'fr'
                        ? item.organisme_nom_fr
                        : item.organisme_nom_mg}
                  </Text>
               </View>
               <Text
                  style={{
                     fontSize: widthDevice < 370 ? 12 : 16,
                     flex: 2,
                     textTransform: 'capitalize',
                  }}
                  numberOfLines={widthDevice < 370 ? 2 : 3}
               >
                  {langueActual === 'fr'
                     ? item.objet_contenu_fr
                     : item.objet_contenu_mg}{' '}
               </Text>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
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
                     <Text
                        style={{
                           fontSize: 14,
                           marginLeft: 2,
                        }}
                     >
                        {langueActual === 'fr'
                           ? item.thematique_nom_fr
                           : item.thematique_nom_mg}{' '}
                        {' / '}
                        {langueActual === 'fr'
                           ? item.type_nom_fr
                           : item.type_nom_mg}
                     </Text>
                  </View>
                  <View
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: 108,
                        justifyContent: 'flex-end',
                     }}
                  >
                     <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                           alert('PDF');
                        }}
                     >
                        <Icon
                           name={'file-download'}
                           color={Colors.violet}
                           size={28}
                        />
                     </TouchableOpacity>
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
         <SafeAreaView>
            <FlatList
               data={allContenusFilter}
               ListHeaderComponent={
                  <View>
                     <View style={styles.head_content}>
                        <View
                           style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                           }}
                        >
                           <TouchableOpacity activeOpacity={0.7}>
                              <Icon
                                 name={'mic'}
                                 color={Colors.violet}
                                 size={30}
                              />
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
                              onChangeText={(text) =>
                                 onHandleChangeValueSearch(text)
                              }
                           />
                           <TouchableOpacity
                              activeOpacity={0.8}
                              /*onPress={() => {
                        findObjectContainValueSearch(valueForSearch);
                     }}*/
                           >
                              <Text style={styles.boutton_search}>
                                 <Icon
                                    name={'search'}
                                    color={Colors.black}
                                    size={40}
                                 />
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
                                    {langueActual === 'fr'
                                       ? 'Thématique'
                                       : 'Lohahevitra'}
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
                                       {allThematiques.map((thematique) => (
                                          <MenuOption
                                             onSelect={() =>
                                                filterByThematique(
                                                   langueActual === 'fr'
                                                      ? thematique.name_fr?.substring(
                                                           0,
                                                           5
                                                        )
                                                      : thematique.name_mg?.substring(
                                                           0,
                                                           5
                                                        )
                                                )
                                             }
                                             key={thematique.id}
                                          >
                                             <MenuOptionCustom
                                                text={
                                                   langueActual === 'fr'
                                                      ? thematique.name_fr
                                                      : thematique.name_mg
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
                                                      ? type.name_fr
                                                      : type.name_mg
                                                )
                                             }
                                             key={type.id}
                                          >
                                             <MenuOptionCustom
                                                text={
                                                   langueActual === 'fr'
                                                      ? type.name_fr
                                                      : type.name_mg
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
                                    {langueActual === 'fr'
                                       ? 'Type'
                                       : 'Karazana'}
                                 </Text>
                                 {typeChecked !== null && (
                                    <Text>{typeChecked}</Text>
                                 )}
                              </View>
                           </View>
                        </View>
                     </View>
                     <View style={styles.view_for_result}>
                        {allContenusFilter?.length > 0 && (
                           <Text style={{ textAlign: 'center' }}>
                              {allContenusFilter.length}{' '}
                              {langueActual === 'fr'
                                 ? ' résultats trouvés'
                                 : ' ny valiny hita'}
                           </Text>
                        )}
                     </View>
                  </View>
               }
               ListEmptyComponent={
                  <View
                     style={{
                        display: 'flex',
                        borderWidth: 1,
                        borderColor: Colors.orange,
                        borderRadius: 8,
                        padding: widthDevice < 370 ? 8 : 12,
                        marginVertical: widthDevice < 370 ? 8 : 12,
                     }}
                  >
                     <Text
                        style={{
                           textAlign: 'center',
                           color: Colors.orange,
                           fontSize: widthDevice < 370 ? 16 : 22,
                        }}
                     >
                        {langueActual === 'fr'
                           ? 'pas de résultat'
                           : '0 ny valiny'}
                     </Text>
                  </View>
               }
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
   );
}
