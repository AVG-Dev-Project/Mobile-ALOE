import { useRef, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Colors } from '_theme/Colors';
import NetInfo from '@react-native-community/netinfo';
import Lottie from 'lottie-react-native';
import { Icon } from '@rneui/base';
import { useSelector, useDispatch } from 'react-redux';
import {
   getStarted,
   isConnectedToInternet,
} from '_utils/redux/actions/action_creators';
import {
   nameStackNavigation as nameNav,
   getDataFromLocalStorage,
} from '_utils';

export default function Welcome({ navigation }) {
   //all datas
   const animation = useRef(null);
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const connexion = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const [isDataAlsoDownloaded, setIsDataAlsoDownloaded] = useState(false);

   //functions

   //deux functions selon disponibilité de connexion
   /*const getOnlineDatas = () => {
      getArticles();
      getThematiques();
      getTypes();
   };*/

   //all effects
   /*effect pour ecouter quand l'user active sa connexion*/
   useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
         dispatch(isConnectedToInternet(state.isConnected));
      });

      return unsubscribe;
   }, []);

   /*useEffect(() => {
      if (connexion) {
         getOnlineDatas();
      }
   }, [connexion]);*/

   useEffect(() => {
      getDataFromLocalStorage('isDataDownloaded').then((res) => {
         if (res === 'true') setIsDataAlsoDownloaded(true);
      });
   }, []);

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
            {connexion ? (
               <Text style={{ textAlign: 'center' }}>
                  Vos données sont prêts, vous pouvez commencer à lire. Veuillez
                  cliquer la flèche droite...
               </Text>
            ) : (
               <Text style={{ textAlign: 'center' }}>
                  Pour commencer cliquez sur le bouton ci-dessous pour
                  télecharger ou importer les données
               </Text>
            )}
         </View>
         <View
            style={{
               display: 'flex',
               flexDirection: 'row',
               width: '100%',
               justifyContent: 'space-evenly',
            }}
         >
            <View style={styles.view_button_arrondi}>
               <TouchableOpacity
                  style={styles.boutton_arrondi}
                  activeOpacity={0.8}
                  onPress={() => {
                     navigation.navigate(nameNav.downloadData);
                  }}
               >
                  <Icon
                     name={'cloud-download'}
                     color={Colors.white}
                     size={34}
                  />
               </TouchableOpacity>
            </View>

            {isDataAlsoDownloaded && (
               <View style={styles.view_button_arrondi}>
                  <TouchableOpacity
                     style={styles.boutton_arrondi}
                     activeOpacity={0.8}
                     onPress={() => {
                        dispatch(getStarted());
                     }}
                  >
                     <Icon
                        name={'arrow-forward'}
                        color={Colors.white}
                        size={34}
                     />
                  </TouchableOpacity>
               </View>
            )}
         </View>
      </View>
   );
}
