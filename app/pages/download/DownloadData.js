import { useRef, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { Icon, Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import DatabaseLayer from 'expo-sqlite-orm/src/DatabaseLayer';
import * as SQLite from 'expo-sqlite';
import {
   getStarted,
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   isConnectedToInternet,
} from '_utils/redux/actions/action_creators';
import {
   ArticleService,
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   insertOrUpdateToDBFunc,
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   storeDataToLocalStorage,
} from '_utils';
import styles from './styles';
//import { articles, types, categories } from '_components/mock/data';

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
   const [isTestConnexion, setIsTestConnexion] = useState(false);
   const [isUploadData, setIsUploadData] = useState(false);

   // ArticleSchema.create(props);

   //all fetch || functions
   /*fetching data function by download from API*/

   /*const getThematiques = async () => {
      let results = await ArticleService.getThematiqueFromServ();
      dispatch(getAllThematiques(results));
   };
   const getTypes = async () => {
      let results = await ArticleService.getTypeFromServ();
      dispatch(getAllTypes(results));
   };*/

   const getArticles = () => {
      ArticleService.getArticlesFromServ()
         .then((results) => {
            dispatch(getAllArticles(results));
         })
         .catch((error) => {
            console.error('Error while getting articles:', error);
         });
   };
   const getThematiques = () => {
      ArticleService.getThematiqueFromServ()
         .then((results) => {
            dispatch(getAllThematiques(results));
         })
         .catch((error) => {
            console.error('Error while getting thematiques:', error);
         });
   };
   const getTypes = () => {
      ArticleService.getTypeFromServ()
         .then((results) => {
            dispatch(getAllTypes(results));
            setIsFetchData(false);
            storeDataToLocalStorage('isDataDownloaded', 'true');
         })
         .catch((error) => {
            console.error('Error while getting types:', error);
         });
   };

   // functions selon disponibilité de connexion 1 pour démarrer tous les fonction fetch depuis API 2 pour importer les données depuis le fichier
   const getOnlineDatas = () => {
      setIsFetchData(true);
      getArticles();
      getThematiques();
      getTypes();
   };

   const testConnexion = () => {
      setIsTestConnexion(true);
      NetInfo.fetch().then((state) => {
         dispatch(isConnectedToInternet(state.isConnected));
         setTimeout(() => {
            setIsTestConnexion(false);
         }, 1000);
      });
   };

   const showData = () => {
      return ArticleSchema.query({ columns: '*' }).then((res) =>
         console.log(res)
      );
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
            storeDataToLocalStorage('isDataDownloaded', 'true');
         } else {
            setIsUploadData(false);
         }
      } catch (error) {
         console.log(error);
         setIsUploadData(false);
      }
   };

   const getConnexionStatusText = () => {
      if (isTestConnexion) {
         return '...';
      }
      if (connexion) return 'Vous êtes connectés à internet';

      return "Vous n'êtes pas connectés";
   };

   //all effects
   /*effect pour ecouter quand l'user active sa connexion*/
   useEffect(() => {
      testConnexion();
   }, []);

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
                  Status : {getConnexionStatusText()}
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
               <Button
                  title="Tester votre connexion"
                  onPress={() => testConnexion()}
                  icon={{
                     name: 'restore',
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
                  loading={isTestConnexion}
               />

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
                     onPress={() => getOnlineDatas()}
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
                  dispatch(getStarted());
               }}
            />
         </View>
      </View>
   );
}
