import { useRef, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { Icon } from '@rneui/base';
import { useSelector } from 'react-redux';
import { ArticleService, nameStackNavigation as nameNav } from '_utils';
//import { articles, types, categories } from '_components/mock/data';

export default function Welcome({ navigation }) {
   //all datas
   const animation = useRef(null);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );

   //all fetch || functions
   /*fetching data function*/
   /*const getArticles = async () => {
      let results = await ArticleService.getArticlesFromServ();
      dispatch(getAllArticles(results));
   };

   const getThematiques = async () => {
      let results = await ArticleService.getThematiqueFromServ();
      dispatch(getAllThematiques(results));
   };
   const getTypes = async () => {
      let results = await ArticleService.getTypeFromServ();
      dispatch(getAllTypes(results));
   };

   //deux functions selon disponibilité de connexion
   const getOnlineDatas = () => {
      getArticles();
      getThematiques();
      getTypes();
   };*/

   //all effects
   /*effect pour ecouter quand l'user active sa connexion*/
   /*useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
         dispatch(isConnectedToInternet(state.isConnected));
      });
      setUnsubscribe(unsubscribe);
   }, []);
   useEffect(() => {
      return () => {
         if (unsubscribe) {
            unsubscribe();
         }
      };
   }, [unsubscribe]);

   useEffect(() => {
      if (connexion) {
         getOnlineDatas();
      }
   }, [connexion]);*/

   return (
      <View style={styles.view_container_welcome}>
         <Lottie
            autoPlay
            ref={animation}
            style={styles.images_welcome}
            source={require('_images/read.json')}
         />
         <View>
            <Text
               style={{ fontSize: 34, fontWeight: 'bold', textAlign: 'center' }}
            >
               {langueActual === 'fr'
                  ? 'Bienvenue sur Aloe'
                  : "Tongasoa eto amin'ny Aloe"}
            </Text>
            <Text style={{ textAlign: 'center', marginVertical: 10 }}>
               C'est une application mobile où vous trouvez tous les lois
               forêstiers ici à Madagascar que vous pouvez consulter à tout
               moment. Avec ou sans internet, vous pouvez la consulter avec
               toute tranquilité.
            </Text>
            <Text style={{ textAlign: 'center' }}>
               Pour commencer cliquez sur le bouton ci-dessous pour télecharger
               ou importer les données
            </Text>
         </View>
         <View style={styles.view_button_start}>
            <TouchableOpacity
               style={styles.boutton_start}
               activeOpacity={0.8}
               onPress={() => {
                  navigation.navigate(nameNav.downloadData);
               }}
            >
               <Icon name={'arrow-forward'} color={Colors.white} size={34} />
            </TouchableOpacity>
         </View>
      </View>
   );
}
