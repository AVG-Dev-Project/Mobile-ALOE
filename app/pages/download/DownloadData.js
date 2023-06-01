import { useRef, useEffect, useState } from 'react';
import {
   Text,
   ScrollView,
   View,
   useWindowDimensions,
   ToastAndroid,
} from 'react-native';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { Icon, Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {
   getStarted,
   isNetworkActive,
   addFavoris,
   isConnectedToInternet,
   checktatusData,
   dataForStatistique,
} from '_utils/redux/actions/action_creators';
import {
   insertOrUpdateToDBFunc,
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   getFavoriteFromLocalStorage,
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchContenusToApi,
   fetchTagsToApi,
   fetchThematiquesToApi,
   fetchAllDataToLocalDatabase,
   checkAndsendMailFromLocalDBToAPI,
   storeStatistiqueToLocalStorage,
} from '_utils';
import styles from './styles';

export default function DownloadData({ navigation }) {
   //all datas
   const animation = useRef(null);
   const { width } = useWindowDimensions();
   const dispatch = useDispatch();
   const isUserNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const isUserConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const isDataAvailable = useSelector(
      (selector) => selector.fonctionnality.isDataAvailable
   );
   const [isFetchData, setIsFetchData] = useState(false);
   const [isUploadData, setIsUploadData] = useState(false);
   /*const [isAllDataAlsoUploaded, setIsAllDataAlsoUploaded] = useState(false);
   const [isAllDataAlsoDownloaded, setIsAllDataAlsoDownloaded] =
      useState(false);*/
   const [buttonStartDisabled, setButtonStartDisabled] = useState(true);
   const [isDataLoaded, setIsDataLoaded] = useState(false);
   const [messageStatusInternet, setMessageStatusInternet] = useState('');

   //all functions
   // functions selon disponibilité de isUserNetworkActive 1 pour démarrer tous les fonction fetch depuis API 2 pour importer les données depuis le fichier
   const getOnlineDatas = async () => {
      let resContenu = await fetchContenusToApi(1);
      let resArticle = await fetchArticlesToApi(1);
      let resTheme = await fetchThematiquesToApi();
      let resTag = await fetchTagsToApi();
      let resType = await fetchTypesToApi();
      await storeStatistiqueToLocalStorage();
      if (
         resContenu.results?.length > 0 &&
         resArticle.results?.length > 0 &&
         resTheme.results?.length > 0 &&
         resType.results?.length > 0 &&
         resTag.results?.length > 0
      ) {
         storeDataToLocalStorage('isAllDataDownloaded', 'true');
         dispatch(checktatusData(true));
      } else {
         ToastAndroid.show(
            'Certain contenu ne sont pas disponible et non pas été télecharger.',
            ToastAndroid.SHORT
         );
      }
      setIsFetchData(false);
   };

   const fetchStatistique = () => {
      getDataFromLocalStorage('articleTotalInServ').then((res) => {
         dispatch(dataForStatistique({ statsFor: 'article', value: res ?? 0 }));
      });
      getDataFromLocalStorage('contenuTotalInServ').then((res) => {
         dispatch(dataForStatistique({ statsFor: 'contenu', value: res ?? 0 }));
      });
   };

   const getOfflineDatas = async () => {
      getFavoriteFromLocalStorage().then((res) => {
         if (res !== null) {
            dispatch(addFavoris(res));
         }
      });
      fetchStatistique();
      fetchAllDataToLocalDatabase(dispatch);
      setTimeout(() => {
         setIsDataLoaded(false);
         dispatch(getStarted());
      }, 500);
   };

   const handleFileSelectionAndImportData = async () => {
      setIsUploadData(true);
      try {
         const file = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
         });
         if (file.type === 'success') {
            const fileContent = await FileSystem.readAsStringAsync(file.uri);
            const parsedJSONData = JSON.parse(fileContent);
            const parsedJsonToArray = Object.values(parsedJSONData);
            let [type, thematique, article, contenu] = parsedJsonToArray;
            //store total of article and contenu to storage
            storeDataToLocalStorage(
               'articleTotalInServ',
               JSON.parse(article.length ?? 0)
            );
            storeDataToLocalStorage(
               'contenuTotalInServ',
               JSON.parse(contenu.length ?? 0)
            );

            //type
            insertOrUpdateToDBFunc('database', 'type', type);

            //thematique
            insertOrUpdateToDBFunc('database', 'thematique', thematique);

            //article
            insertOrUpdateToDBFunc(
               'database',
               'article',
               parseStructureDataForArticle(article)
            );

            //contenu
            await insertOrUpdateToDBFunc(
               'database',
               'contenu',
               parseStructureDataForContenu(contenu)
            );
            setIsUploadData(false);
            storeDataToLocalStorage('isAllDataImported', 'true');
            dispatch(checktatusData(true));
         } else {
            setIsUploadData(false);
         }
      } catch (error) {
         console.log(error);
         setIsUploadData(false);
      }
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
      if (isUserConnectedToInternet && isUserNetworkActive) {
         setMessageStatusInternet(
            'Comme vous êtes connecté à internet, vous pouvez soit télechargés les datas via votre connexion soit uploader le fichier datas'
         );
         checkAndsendMailFromLocalDBToAPI();
      }
      if (
         isUserNetworkActive &&
         (isUserConnectedToInternet === false ||
            isUserConnectedToInternet === null)
      ) {
         setMessageStatusInternet(
            'Votre connexion ne peut pas accéder à internet. Vous pouvez quand même importer le fichier datas depuis votre appareil.'
         );
      }
      if (isNetworkActive === false || isNetworkActive === null) {
         setMessageStatusInternet(
            "Vous n'êtes pas connecté à internet. Vous pouvez importer le fichier datas depuis votre appareil."
         );
      }
   }, [isUserConnectedToInternet, isUserNetworkActive]);

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
   }, [isUploadData, isFetchData]);

   useEffect(() => {
      if (
         /*isAllDataAlsoDownloaded || isAllDataAlsoUploaded*/ isDataAvailable
      ) {
         return setButtonStartDisabled(false);
      }
   }, [
      /*isAllDataAlsoDownloaded,
      isAllDataAlsoUploaded,*/
      isDataAvailable,
      isUploadData,
      isFetchData,
   ]);

   return (
      <ScrollView>
         <View style={styles.view_container_download}>
            <Lottie
               autoPlay
               ref={animation}
               style={styles.images_welcome}
               source={require('_images/upload.json')}
            />
            <View style={styles.view_instruction}>
               <View style={styles.view_status_connexion}>
                  <Text
                     style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                     }}
                  >
                     Status :{' '}
                     {isUserNetworkActive && isUserConnectedToInternet
                        ? 'Vous êtes connectés à internet'
                        : "Vous n'êtes pas connectés"}
                  </Text>
                  {isUserNetworkActive && isUserConnectedToInternet ? (
                     <Icon
                        name={'sentiment-satisfied-alt'}
                        color={Colors.greenAvg}
                        size={24}
                     />
                  ) : (
                     <Icon
                        name={'sentiment-very-dissatisfied'}
                        color={Colors.redError}
                        size={24}
                     />
                  )}
               </View>
               <Text style={{ textAlign: 'center' }}>
                  {messageStatusInternet}
               </Text>
               <View style={styles.view_for_button}>
                  {isUserNetworkActive && isUserConnectedToInternet && (
                     <Button
                        title="Télecharger les datas"
                        icon={{
                           name: 'file-download',
                           type: 'material',
                           size: 24,
                           color: Colors.white,
                        }}
                        titleStyle={{ fontSize: 16 }}
                        buttonStyle={{
                           borderRadius: 15,
                           backgroundColor: Colors.greenAvg,
                        }}
                        containerStyle={{
                           width: 250,
                           marginVertical: 5,
                        }}
                        onPress={() => {
                           setIsFetchData(true);
                           getOnlineDatas();
                        }}
                        loading={isFetchData}
                     />
                  )}

                  {isUserNetworkActive && isUserConnectedToInternet && (
                     <Text style={{ textAlign: 'center', fontSize: 18 }}>
                        {' '}
                        ou{' '}
                     </Text>
                  )}

                  <Button
                     title="Importer le fichier"
                     icon={{
                        name: 'file-upload',
                        type: 'material',
                        size: 24,
                        color: Colors.white,
                     }}
                     titleStyle={{ fontSize: 16 }}
                     buttonStyle={{
                        borderRadius: 15,
                        backgroundColor: Colors.greenAvg,
                     }}
                     containerStyle={{
                        width: 250,
                        marginVertical: 5,
                     }}
                     onPress={() => handleFileSelectionAndImportData()}
                     loading={isUploadData}
                  />
               </View>
            </View>
            <View>
               <Button
                  title="Commencer"
                  icon={{
                     name: 'double-arrow',
                     type: 'material',
                     size: 24,
                     color: Colors.white,
                  }}
                  titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
                  buttonStyle={{
                     borderRadius: 30,
                     backgroundColor: Colors.greenAvg,
                     paddingVertical: 24,
                     width: width < 370 ? 170 : 190,
                  }}
                  containerStyle={{
                     marginVertical: 10,
                  }}
                  onPress={() => {
                     setIsDataLoaded(true);
                     getOfflineDatas();
                  }}
                  loading={isDataLoaded}
                  disabled={buttonStartDisabled}
               />
            </View>
         </View>
      </ScrollView>
   );
}
