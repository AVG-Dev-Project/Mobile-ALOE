import { useEffect, useState } from 'react';
import {
   Text,
   View,
   Image,
   TouchableOpacity,
   ScrollView,
   useWindowDimensions,
} from 'react-native';
import styles from './styles';
import { Colors } from '_theme/Colors';
import NetInfo from '@react-native-community/netinfo';
import { Icon, Button } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import {
   getStarted,
   addFavoris,
   isNetworkActive,
   checktatusData,
   isConnectedToInternet,
   dataForStatistique,
} from '_utils/redux/actions/action_creators';
import {
   nameStackNavigation as nameNav,
   getDataFromLocalStorage,
   getFavoriteFromLocalStorage,
   fetchAllDataToLocalDatabase,
   checkAndsendMailFromLocalDBToAPI,
   storeStatistiqueToLocalStorage,
   s,
} from '_utils';

export default function Welcome({ navigation }) {
   //all datas
   const { width } = useWindowDimensions();
   const dispatch = useDispatch();
   const isUserNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const isDataAvailable = useSelector(
      (selector) => selector.fonctionnality.isDataAvailable
   );
   const isUserConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   /*const [isAllDataAlsoUploaded, setIsAllDataAlsoUploaded] = useState(false);
   const [isAllDataAlsoDownloaded, setIsAllDataAlsoDownloaded] =
      useState(false);*/
   const [isDataLoaded, setIsDataLoaded] = useState(false);

   //function
   const fetchStatistique = () => {
      getDataFromLocalStorage('articleTotalInServ').then((res) => {
         dispatch(dataForStatistique({ statsFor: 'article', value: res ?? 0 }));
      });
      getDataFromLocalStorage('contenuTotalInServ').then((res) => {
         dispatch(dataForStatistique({ statsFor: 'contenu', value: res ?? 0 }));
      });
   };

   const getOfflineDatas = async () => {
      if (isUserNetworkActive && isUserConnectedToInternet) {
         await storeStatistiqueToLocalStorage();
      }
      getFavoriteFromLocalStorage().then((res) => {
         if (res !== null) {
            dispatch(addFavoris(res));
         }
      });
      fetchAllDataToLocalDatabase(dispatch);
      fetchStatistique();
      setTimeout(() => {
         setIsDataLoaded(false);
         dispatch(getStarted());
      }, 2000);
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
         if (res === 'true') {
            //setIsAllDataAlsoUploaded(true);
            dispatch(checktatusData(true));
         }
      });
      getDataFromLocalStorage('isAllDataDownloaded').then((res) => {
         if (res === 'true') {
            //setIsAllDataAlsoDownloaded(true);
            dispatch(checktatusData(true));
         }
      });
   }, []);

   useEffect(() => {
      if (isUserConnectedToInternet && isUserNetworkActive) {
         checkAndsendMailFromLocalDBToAPI();
      }
   }, [isUserNetworkActive, isUserConnectedToInternet]);

   return (
      <ScrollView style={styles.view_container_welcome}>
         <View style={{ alignItems: 'center' }}>
            <Image
               style={styles.images_welcome}
               source={require('_images/aloe.png')}
            />
            <Text
               style={{
                  fontSize: width < 370 ? 20 : 30,
                  fontWeight: 'bold',
                  textAlign: 'center',
               }}
            >
               Bienvenue sur ALOE
            </Text>
            {isDataAvailable ? (
               <Text style={{ textAlign: 'center', marginVertical: 5 }}>
                  ALOE ou{' '}
                  <Text
                     style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.greenAvg,
                     }}
                  >
                     Accès sur les LOis Environnementales
                  </Text>{' '}
                  est une application mobile, accessible avec ou sans internet,
                  qui regroupe les textes de lois environnementales et
                  anticorruption pour contribuer à la réduction du trafic
                  d'espèces sauvages afin d'améliorer la gouvernance des
                  ressources naturelles.
               </Text>
            ) : (
               <>
                  <Text style={{ textAlign: 'center', marginVertical: 5 }}>
                     Inspiré par le Ministère de la Justice et le Ministère de
                     l'environnement et du développement durable, il a été
                     confirmé qu'il est indispensable de donner à tous les
                     acteurs de la Chaine de Justice environnementale, des
                     outils de travail.
                  </Text>
                  <Text style={{ textAlign: 'center', marginBottom: 5 }}>
                     Dans cette optique, ALOE ou{' '}
                     <Text
                        style={{
                           fontSize: 16,
                           fontWeight: 'bold',
                           color: Colors.greenAvg,
                        }}
                     >
                        Accès sur les LOis Environnementales
                     </Text>{' '}
                     est une application mobile, accessible avec ou sans
                     Internet, qui regroupe les textes de lois environnementales
                     et anticorruption pour contribuer à la réduction du trafic
                     d'espèces sauvages afin d'améliorer la gouvernance des
                     ressources naturelles.
                  </Text>
               </>
            )}
            {isDataAvailable ? (
               <Text style={{ textAlign: 'center' }}>
                  Cliquez sur la flèche droite pour démarrer.
               </Text>
            ) : (
               <Text style={{ textAlign: 'center' }}>
                  Pour démarrer, cliquez sur le bouton suivant pour télecharger
                  ou importer les données.
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
            {isDataAvailable ? (
               <View style={styles.view_button_arrondi}>
                  <Button
                     icon={{
                        name: 'arrow-forward',
                        type: 'material',
                        size: 34,
                        color: Colors.white,
                     }}
                     titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
                     buttonStyle={styles.bouttonStyle}
                     onPress={() => {
                        getOfflineDatas();
                        setIsDataLoaded(true);
                     }}
                     loading={isDataLoaded}
                  />
               </View>
            ) : (
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
            )}
         </View>
         <View style={styles.viewPartenaire}>
            <Text style={styles.labelDescriptionLogoUsaid}>
               Sous l'appui technique et financier de{' '}
            </Text>
            <Image
               style={styles.logo_image}
               source={require('_images/usaid.png')}
            />
         </View>
      </ScrollView>
   );
}
