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
   dataForStatistique,
} from '_utils/redux/actions/action_creators';
import {
   insertOrUpdateToDBFunc,
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   getFavoriteFromLocalStorage,
   fetchAllDataToLocalDatabase,
   checkAndsendMailFromLocalDBToAPI,
} from '_utils';
import styles from './styles';

export default function ImportedData({ navigation }) {
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
   const [isUploadData, setIsUploadData] = useState(false);
   /*const [isAllDataAlsoUploaded, setIsAllDataAlsoUploaded] = useState(false);
   const [isAllDataAlsoDownloaded, setIsAllDataAlsoDownloaded] =
      useState(false);*/
   const [isDataLoaded, setIsDataLoaded] = useState(false);
   const [messageStatusInternet, setMessageStatusInternet] = useState('');

   //all functions
   // functions selon disponibilité de isUserNetworkActive 1 pour démarrer tous les fonction fetch depuis API 2 pour importer les données depuis le fichier
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
            let [types, thematiques, articles, contenus, tags] =
               parsedJsonToArray;
            //store total of article and contenu to storage
            storeDataToLocalStorage(
               'articleTotalInServ',
               JSON.parse(articles.length ?? 0)
            );
            storeDataToLocalStorage(
               'contenuTotalInServ',
               JSON.parse(contenus.length ?? 0)
            );

            //type
            insertOrUpdateToDBFunc('database', 'type', types);

            //thematique
            insertOrUpdateToDBFunc('database', 'thematique', thematiques);

            //tag
            insertOrUpdateToDBFunc('database', 'tag', tags);

            //article
            insertOrUpdateToDBFunc(
               'database',
               'article',
               parseStructureDataForArticle(articles)
            );

            //contenu
            await insertOrUpdateToDBFunc(
               'database',
               'contenu',
               parseStructureDataForContenu(contenus)
            );
            await getOfflineDatas();
            setIsUploadData(false);
         } else {
            setIsUploadData(false);
         }
      } catch (error) {
         ToastAndroid.show(
            `Erreur survenu à l'importation du fichier.`,
            ToastAndroid.SHORT
         );
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
            'Vous pouvez importer les fichiers de données à partir de votre appareil.'
         );
         checkAndsendMailFromLocalDBToAPI();
      }
      if (
         isUserNetworkActive &&
         (isUserConnectedToInternet === false ||
            isUserConnectedToInternet === null)
      ) {
         setMessageStatusInternet(
            'Vous pouvez importer les fichiers de données à partir de votre appareil.'
         );
      }
      if (isNetworkActive === false || isNetworkActive === null) {
         setMessageStatusInternet(
            'Vous pouvez importer les fichiers de données à partir de votre appareil.'
         );
      }
   }, [isUserConnectedToInternet, isUserNetworkActive]);

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
                        ? 'Vous avez accès à Internet'
                        : "Vous n'avez pas accès à Internet"}
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
                        paddingVertical: 14,
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
                  title="Retour"
                  titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
                  buttonStyle={{
                     borderRadius: 30,
                     backgroundColor: Colors.greenAvg,
                     paddingVertical: 16,
                     width: width < 370 ? 150 : 170,
                  }}
                  containerStyle={{
                     marginVertical: 10,
                  }}
                  onPress={() => {
                     navigation.goBack();
                  }}
                  loading={isDataLoaded}
               />
            </View>
         </View>
      </ScrollView>
   );
}
