import { createStackNavigator } from '@react-navigation/stack';
//name util for stack navigation
import { nameStackNavigation as nameNav } from '_utils';
/*tab Navitation (top and bottom both)*/
import BottomBarTabs from '_components/navigation/tabs/BottomBarTabs';
/*screen normal |screen indépendant à afficher|*/
import { Welcome } from '_pages';
import { configStack } from './configStack';
import { useSelector, useDispatch } from 'react-redux';
import Listing from '_components/listing/ListingScreen';
import ListingCatg from '_components/allCategories/ListingCatg';
import ListingTypes from '_components/allTypes/ListingTypes';
import Detail from '_components/detail/DetailScreen';

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
               name={nameNav.listPage}
               component={Listing}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />

            <Stack.Screen
               name={nameNav.listCategorie}
               component={ListingCatg}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />

            <Stack.Screen
               name={nameNav.listType}
               component={ListingTypes}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />
         </Stack.Group>

         <Stack.Group
            screenOptions={configStack.screenOptionsForHeaderTransparent}
         >
            <Stack.Screen
               name={nameNav.detailPage}
               component={Detail}
               options={({ route }) => ({
                  title: route.params.titleScreen,
               })}
            />
         </Stack.Group>
      </Stack.Navigator>
   ) : (
      <Stack.Navigator initialRouteName={nameNav.login}>
         <Stack.Group screenOptions={configStack.screenOptionsForHeaderDisable}>
            <Stack.Screen name={nameNav.welcome} component={Welcome} />
         </Stack.Group>
      </Stack.Navigator>
   );
}
