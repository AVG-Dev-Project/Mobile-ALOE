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
import { Icon, Button } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import {
   getStarted,
   addFavoris,
   isNetworkActive,
   getCurrentPageForApi,
   isConnectedToInternet,
} from '_utils/redux/actions/action_creators';
import {
   nameStackNavigation as nameNav,
   getDataFromLocalStorage,
   removeInLocalStorage,
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
   fetchContenusToApi,
   getFavoriteFromLocalStorage,
   fetchArtiContenuToLocalDatabase,
   fetchTypeThemToLocalDatabase,
   checkAndsendMailFromLocalDBToAPI,
} from '_utils';

export default function Welcome({ navigation }) {
   //all datas
   const animation = useRef(null);
   const { width } = useWindowDimensions();
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isUserNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const currentPageApi = useSelector((selector) => selector.loi.currentPage);
   const isUserConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const [isAllDataAlsoUploaded, setIsAllDataAlsoUploaded] = useState(false);
   const [isAllDataAlsoDownloaded, setIsAllDataAlsoDownloaded] =
      useState(false);
   const [isDataLoaded, setIsDataLoaded] = useState(false);

   //functions
   //deux functions selon disponibilité de isUserNetworkActive (une pour fetcher 10 datas afin de peupler la base)

   const getSmallDatasOnLine = async () => {
      fetchContenusToApi(currentPageApi);
      fetchArticlesToApi(currentPageApi, dispatch);
      fetchThematiquesToApi();
      await fetchTypesToApi();
   };

   const getOfflineDatas = async () => {
      if (isUserNetworkActive && isUserConnectedToInternet) {
         await getSmallDatasOnLine();
      }
      getFavoriteFromLocalStorage().then((res) => {
         if (res !== null) {
            dispatch(addFavoris(res));
         }
      });
      fetchArtiContenuToLocalDatabase(dispatch, 1);
      fetchTypeThemToLocalDatabase(dispatch);
      setTimeout(() => {
         setIsDataLoaded(false);
         dispatch(getStarted());
      }, 1000);
   };

   //all effects
   /*effect pour ecouter quand l'user active sa isUserNetworkActive*/
   useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
         dispatch(isNetworkActive(state.isConnected));
         dispatch(isConnectedToInternet(state.isInternetReachable));
      });

      return unsubscribe;
   }, []);

   useEffect(() => {
      getDataFromLocalStorage('isAllDataImported').then((res) => {
         if (res === 'true') setIsAllDataAlsoUploaded(true);
      });
      getDataFromLocalStorage('isAllDataDownloaded').then((res) => {
         if (res === 'true') setIsAllDataAlsoDownloaded(true);
      });
      getDataFromLocalStorage('currentPageApi').then((res) => {
         dispatch(getCurrentPageForApi(parseInt(res)));
      });
   }, []);

   useEffect(() => {
      if (isUserConnectedToInternet && isUserNetworkActive) {
         checkAndsendMailFromLocalDBToAPI();
      }
   }, [isUserNetworkActive, isUserConnectedToInternet]);

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
            {isAllDataAlsoUploaded || isAllDataAlsoDownloaded ? (
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
                  <Button
                     icon={{
                        name: 'arrow-forward',
                        type: 'material',
                        size: 34,
                        color: Colors.white,
                     }}
                     titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
                     buttonStyle={{
                        backgroundColor: Colors.greenAvg,
                        margin: 8,
                        minWidth: width < 370 ? 70 : 70,
                        minHeight: 70,
                        borderRadius: 60,
                     }}
                     containerStyle={{}}
                     onPress={() => {
                        setIsDataLoaded(true);
                        getOfflineDatas();
                     }}
                     loading={isDataLoaded}
                  />
               </View>
            )}
         </View>
      </View>
   );
}
