// import 'react-native-gesture-handler';
import './ignoreWarning';
import './startup';
import 'expo-dev-client';
import './i18nextConf';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '_theme/Colors';
import { useEffect, useState } from 'react';
import Navigation from '_components/navigation/navigation';
import { Provider } from 'react-redux';
import { store } from '_utils/redux/store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
   pushNotification,
   useNotification,
   getDataFromLocalStorage,
   ArticleSchema,
   ContenuSchema,
} from '_utils';

export default function App() {
   let [statistique, setStatistique] = useState({article: 0, contenu: 0, totalArticle: 0, totalContenu: 0});
   const { registerForPushNotificationsAsync } = useNotification();

   useEffect(() => {
      getDataFromLocalStorage('articleTotalInServ').then((res) => {
         setStatistique(prevState => {
            return { ...prevState, totalArticle: res ?? 0 };
         })
      });
      getDataFromLocalStorage('contenuTotalInServ').then((res) => {
         setStatistique(prevState => {
            return { ...prevState, totalContenu: res ?? 0 };
         })
      });
      //article
   ArticleSchema.query({ columns: '*', order: 'id ASC' }).then((results) => {
      setStatistique(prevState => {
            return { ...prevState, article: results.length ?? 0 };
         })
   });
   //contenu
   ContenuSchema.query({ columns: '*', order: 'numero ASC' }).then(
      (results) => {
         setStatistique(prevState => {
            return { ...prevState, contenu: results.length ?? 0 };
         })
      }
   );
   }, []);

   /*setInterval(() => {
      //pushNotification("Ressources disponible", "Vous n'avez pas encore télecharger toute les ressources");
   }, 5000)*/

   return (
      <Provider store={store}>
         <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
               <BottomSheetModalProvider>
                  <StatusBar backgroundColor={Colors.greenAvg} />
                  <Navigation />
               </BottomSheetModalProvider>
            </GestureHandlerRootView>
         </SafeAreaProvider>
      </Provider>
   );
}
