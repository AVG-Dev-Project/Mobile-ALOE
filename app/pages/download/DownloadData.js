import { useRef, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { Icon, Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {
   getStarted,
   isConnectedToInternet,
} from '_utils/redux/actions/action_creators';
import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   insertOrUpdateToDBFunc,
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   removeInLocalStorage,
   getAllKeys,
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchContenusToApi,
   fetchThematiquesToApi,
   fetchDataToLocalDatabase,
} from '_utils';
import styles from './styles';

export default function DownloadData({ navigation }) {
   //all datas
   const animation = useRef(null);
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const connexion = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const [isFetchData, setIsFetchData] = useState(false);
   const [isUploadData, setIsUploadData] = useState(false);
   const [isAllDataAlsoUploaded, setIsAllDataAlsoUploaded] = useState(false);
   const [isAllDataAlsoDownloaded, setIsAllDataAlsoDownloaded] =
      useState(false);
   const [buttonStartDisabled, setButtonStartDisabled] = useState(true);
   const [isDataLoaded, setIsDataLoaded] = useState(false);

   //all functions
   // functions selon disponibilité de connexion 1 pour démarrer tous les fonction fetch depuis API 2 pour importer les données depuis le fichier
   const getOnlineDatas = async () => {
      fetchArticlesToApi();
      fetchContenusToApi();
      fetchThematiquesToApi();
      await fetchTypesToApi();
      setIsFetchData(false);
      storeDataToLocalStorage('isAllDataDownloaded', 'true');
   };

   const getOfflineDatas = () => {
      fetchDataToLocalDatabase(dispatch);
      setTimeout(() => {
         setIsDataLoaded(false);
         dispatch(getStarted());
      }, 1000);
   };

   const showData = () => {
      return ContenuSchema.query({ columns: '*' }).then((res) => {
         console.log(res.length);
      });
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
         } else {
            setIsUploadData(false);
         }
      } catch (error) {
         console.log(error);
         setIsUploadData(false);
      }
   };

   //all effects
   /*effect pour ecouter quand l'user active sa connexion*/
   useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
         dispatch(isConnectedToInternet(state.isConnected));
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
   }, [isUploadData, isFetchData]);

   useEffect(() => {
      if (isAllDataAlsoDownloaded || isAllDataAlsoUploaded) {
         return setButtonStartDisabled(false);
      }
   }, [
      isAllDataAlsoDownloaded,
      isAllDataAlsoUploaded,
      isUploadData,
      isFetchData,
   ]);

   return (
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
                  {connexion
                     ? 'Vous êtes connectés à internet'
                     : "Vous n'êtes pas connectés"}
               </Text>
               {connexion ? (
                  <Icon
                     name={'sentiment-satisfied-alt'}
                     color={Colors.violet}
                     size={24}
                  />
               ) : (
                  <Icon
                     name={'sentiment-very-dissatisfied'}
                     color={Colors.orange}
                     size={24}
                  />
               )}
            </View>
            <Text style={{ textAlign: 'center' }}>
               {connexion
                  ? `Ici vous avez le choix entre télécharger les données via votre connexion ou préférez-vous importer vos données depuis votre appareil `
                  : "Comme vous n'êtes pas connecté vous pouvez importé le fichier depuis votre appareil!"}
            </Text>
            <View style={styles.view_for_button}>
               {connexion && (
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
                        backgroundColor: Colors.violet,
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

               {connexion && (
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
                     backgroundColor: Colors.violet,
                  }}
                  containerStyle={{
                     width: 250,
                     marginVertical: 5,
                  }}
                  onPress={() => handleFileSelectionAndImportData()}
                  loading={isUploadData}
               />

               <Button
                  title="Show data"
                  icon={{
                     name: 'file-upload',
                     type: 'material',
                     size: 24,
                     color: Colors.white,
                  }}
                  titleStyle={{ fontSize: 16 }}
                  buttonStyle={{
                     borderRadius: 15,
                     backgroundColor: Colors.violet,
                  }}
                  containerStyle={{
                     width: 250,
                     marginVertical: 5,
                  }}
                  onPress={() => showData()}
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
                  backgroundColor: Colors.violet,
                  paddingVertical: 24,
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
   );
}
