import { createStackNavigator } from '@react-navigation/stack';
//name util for stack navigation
import { nameStackNavigation as nameNav } from '_utils';
/*tab Navitation (top and bottom both)*/
import BottomBarTabs from '_components/navigation/tabs/BottomBarTabs';
/*screen normal |screen indépendant à afficher|*/
import { Welcome, Doleance, DownloadData, ImportedData } from '_pages';
import { configStack } from './configStack';
import { useSelector } from 'react-redux';
import ListingArticle from '_components/listing/ListingArticleScreen';
import ListingContenu from '_components/listing/ListingContenuScreen';
import Detail from '_components/detail/DetailScreen';
import Information from '_components/informationAvg/information';

let Stack = createStackNavigator();
export default function StackNavigation() {
   const isStarted = useSelector((selector) => selector.fonctionnality.started);

   return isStarted ? (
      <Stack.Navigator initialRouteName={nameNav.home}>
         <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name={nameNav.home} component={BottomBarTabs} />
         </Stack.Group>

         <Stack.Group screenOptions={configStack.screenOptionsForHeaderShown}>
            <Stack.Screen
               name={nameNav.listArticle}
               component={ListingArticle}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />

            <Stack.Screen
               name={nameNav.listContenu}
               component={ListingContenu}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />
         </Stack.Group>

         <Stack.Group screenOptions={configStack.screenOptionsForHeaderDisable}>
            <Stack.Screen
               name={nameNav.detailPage}
               component={Detail}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />
            <Stack.Screen
               name={nameNav.importedData}
               component={ImportedData}
            />
         </Stack.Group>

         <Stack.Group
            screenOptions={configStack.screenOptionsForHeaderTransparent}
         >
            <Stack.Screen
               name={nameNav.doleance}
               component={Doleance}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />

            <Stack.Screen
               name={nameNav.information}
               component={Information}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />
         </Stack.Group>
      </Stack.Navigator>
   ) : (
      <Stack.Navigator initialRouteName={nameNav.welcome}>
         <Stack.Group screenOptions={configStack.screenOptionsForHeaderDisable}>
            <Stack.Screen name={nameNav.welcome} component={Welcome} />
            <Stack.Screen
               name={nameNav.downloadData}
               component={DownloadData}
            />
         </Stack.Group>
      </Stack.Navigator>
   );
}
