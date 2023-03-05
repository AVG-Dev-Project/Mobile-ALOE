import { useRef, useEffect, useState } from 'react';
import {
   Text,
   View,
   Image,
   TouchableOpacity,
   useWindowDimensions,
} from 'react-native';
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
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
   fetchDataToLocalDatabase,
} from '_utils';

export default function Welcome({ navigation }) {
   //all datas
   const animation = useRef(null);
   const { width } = useWindowDimensions();
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const connexion = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const [isAllDataAlsoUploaded, setIsAllDataAlsoUploaded] = useState(false);
   const [isAllDataAlsoDownloaded, setIsAllDataAlsoDownloaded] =
      useState(false);

   //functions

   //deux functions selon disponibilité de connexion (une pour fetcher 10 datas afin de peupler la base)
   /*const getSmallDatasOnLine = () => {
      fetchThematiquesToApi(dispatch),
      fetchArticlesToApi(dispatch),
      fetchTypesToApi(dispatch),
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
         return getSmallDatasOnLine();
      }
      getAllDatasOffline()
   }, [connexion]);*/

   useEffect(() => {
      getDataFromLocalStorage('isAllDataImported').then((res) => {
         if (res === 'true') setIsAllDataAlsoUploaded(true);
      });
      getDataFromLocalStorage('isAllDataDownloaded').then((res) => {
         if (res === 'true') setIsAllDataAlsoDownloaded(true);
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
               style={{
                  fontSize: width < 370 ? 28 : 34,
                  fontWeight: 'bold',
                  textAlign: 'center',
               }}
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

            {(isAllDataAlsoUploaded || isAllDataAlsoDownloaded) && (
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
