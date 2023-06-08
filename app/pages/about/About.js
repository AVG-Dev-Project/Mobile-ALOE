import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '_theme/Colors';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import { nameStackNavigation as nameNav, widthPercentageToDP } from '_utils';

export default function About({ navigation }) {
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const totalArticleInServ = useSelector(
      (selector) => selector.loi.statistique.article
   );
   const totalContenuInServ = useSelector(
      (selector) => selector.loi.statistique.contenu
   );
   const allArticles = useSelector((selector) => selector.loi.articles);
   const allContenus = useSelector((selector) => selector.loi.contenus);
   const [statistique, setStatistique] = useState({
      articleFromServ: totalArticleInServ,
      contenuFromServ: totalContenuInServ,
      articlePresent: allArticles.length,
      contenuPresent: allContenus.length,
   });

   useFocusEffect(
      useCallback(() => {
         setStatistique({
            articleFromServ: totalArticleInServ,
            contenuFromServ: totalContenuInServ,
            articlePresent: allArticles.length,
            contenuPresent: allContenus.length,
         });
      }, [totalArticleInServ, totalContenuInServ, allArticles, allContenus])
   );

   return (
      <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
         <View style={styles.view_container}>
            <View style={styles.head_banniere}>
               <Text
                  style={{
                     fontSize: widthPercentageToDP(6),
                     fontWeight: 'bold',
                  }}
               >
                  {langueActual === 'fr' ? 'A propos' : 'Mombamomba'}
               </Text>
               <Image
                  style={styles.banniere_image}
                  source={require('_images/aloe.png')}
               />
               <Text style={{ fontSize: widthPercentageToDP(3.5) }}>
                  {langueActual === 'fr' ? 'Version' : 'Fanovana'} 1.0.0
               </Text>
               <Text
                  style={{
                     fontSize: widthPercentageToDP(3.5),
                  }}
               >
                  {langueActual === 'fr'
                     ? 'Total des textes présents : '
                     : "Isan'ny didy aman-dalàna voarakitra : "}{' '}
                  {statistique.contenuPresent} / {statistique.contenuFromServ}
               </Text>
               <Text
                  style={{
                     fontSize: widthPercentageToDP(3.5),
                  }}
               >
                  {langueActual === 'fr'
                     ? 'Total des articles présents : '
                     : "Isan'ny andininy voarakitra : "}{' '}
                  {statistique.articlePresent} / {statistique.articleFromServ}
               </Text>
            </View>

            <View style={styles.view_content_about}>
               <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                     navigation.navigate(nameNav.information, {
                        titleScreen:
                           langueActual === 'fr' ? 'Information' : 'Mombamomba',
                     })
                  }
               >
                  <Text style={styles.button_link_about}>
                     {langueActual === 'fr'
                        ? "A propos de l'Alliance Voahary Gasy"
                        : "Mombamomban'ny Alliance Voahary Gasy"}
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                     navigation.navigate(nameNav.doleance, {
                        titleScreen:
                           langueActual === 'fr'
                              ? 'Envoi de doléance'
                              : 'Handefa fitarainana',
                     })
                  }
               >
                  <Text
                     style={[
                        styles.button_link_about,
                        { borderBottomWidth: 1 },
                     ]}
                  >
                     {langueActual === 'fr'
                        ? 'Envoi de doléance'
                        : 'Handefa fitarainana'}
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
      </KeyboardAwareScrollView>
   );
}
