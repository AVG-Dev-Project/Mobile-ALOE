import { useRef, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { Icon } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {
   getStarted,
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   isConnectedToInternet,
} from '_utils/redux/actions/action_creators';
import { ArticleService } from '_utils';
//import { articles, types, categories } from '_components/mock/data';
import {
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   removeInLocalStorage,
   getAllKeys,
} from '_utils';

export default function Welcome({ navigation }) {
   //all datas
   const animation = useRef(null);
   const dispatch = useDispatch();
   const [articlesFromAS, setArticlesFromAS] = useState([]);
   const [thematiquesFromAS, setThematiquesFromAS] = useState([]);
   const [typesFromAS, setTypesFromAS] = useState([]);
   const [unsubscribe, setUnsubscribe] = useState(null);
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const connexion = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );

   //all fetch || functions
   /*fetching data function*/
   const getArticles = async () => {
      let results = await ArticleService.getArticlesFromServ();
      dispatch(getAllArticles(results));
      storeDataToLocalStorage('articles', results);
   };

   const getThematiques = async () => {
      let results = await ArticleService.getThematiqueFromServ();
      dispatch(getAllThematiques(results));
      storeDataToLocalStorage('thematiques', results);
   };
   const getTypes = async () => {
      let results = await ArticleService.getTypeFromServ();
      dispatch(getAllTypes(results));
      storeDataToLocalStorage('types', results);
   };

   /*fonction pour getter les données en absence de connexion*/
   const fetchDataFromAS = async (key, setter) => {
      return setter(await getDataFromLocalStorage(key));
   };

   //deux functions selon disponibilité de connexion
   const getOnlineDatas = () => {
      getArticles();
      getThematiques();
      getTypes();
   };

   const getOfflineDatas = () => {
      fetchDataFromAS('articles', setArticlesFromAS);
      fetchDataFromAS('thematiques', setThematiquesFromAS);
      fetchDataFromAS('types', setTypesFromAS);
   };

   //all effects
   /*effect pour ecouter quand l'user active sa connexion*/
   useEffect(() => {
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
      } else {
         getOfflineDatas();
      }
   }, [connexion]);

   /*effect pour loader les data offlines en cas de non présence de connexion*/
   useEffect(() => {
      dispatch(getAllArticles(articlesFromAS));
      dispatch(getAllThematiques(thematiquesFromAS));
      dispatch(getAllTypes(typesFromAS));
   }, [articlesFromAS, thematiquesFromAS, typesFromAS]);

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
               C'est une application mobile où vous trouvez tous les lois ici à
               Madagascar que vous pouvez consulter à tout moment. Avec ou sans
               internet, vous pouvez la consulter avec toute tranquilité. Alors
               vous êtes prêts ? On y va alors ....
            </Text>
            <Text>
               Status de la connexion est :{' '}
               {connexion ? 'connecté' : 'Pas de connexion'}
            </Text>
         </View>
         <View style={styles.view_button_start}>
            <TouchableOpacity
               style={styles.boutton_start}
               activeOpacity={0.8}
               onPress={() => {
                  dispatch(getStarted());
               }}
            >
               <Icon name={'arrow-forward'} color={Colors.white} size={34} />
            </TouchableOpacity>
         </View>
      </View>
   );
}
