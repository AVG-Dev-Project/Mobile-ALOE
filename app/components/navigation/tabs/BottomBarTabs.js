import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '_theme/Colors';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';

//import screen bottom tab
import { Home, About, Recherche, Favoris } from '_pages';

const Tab = createBottomTabNavigator();

export default function BottomBarTabs() {
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isTabBarHide = useSelector(
      (selector) => selector.fonctionnality.isTabBarHide
   );

   return (
      <Tab.Navigator
         initialRouteName="Home"
         screenOptions={{
            headerShown: false,
            tabBarInactiveTintColors: Colors.black,
            tabBarActiveTintColors: Colors.greenAvg,
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: {
               fontSize: 13,
               textTransform: 'capitalize',
               fontWeight: 'bold',
               color: Colors.greenAvg,
            },
            tabBarStyle: styles.tabBarStyles,
         }}
      >
         <Tab.Screen
            name="Home"
            component={Home}
            options={{
               tabBarLabel: ({ focused }) => (
                  <Text
                     style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: focused ? Colors.greenAvg : Colors.grey,
                     }}
                  >
                     {langueActual === 'fr' ? 'Accueil' : 'Fandraisana'}
                  </Text>
               ),
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'home'}
                     color={focused ? Colors.greenAvg : Colors.grey}
                     size={26}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Recherche"
            component={Recherche}
            options={{
               tabBarLabel: ({ focused }) => (
                  <Text
                     style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: focused ? Colors.greenAvg : Colors.grey,
                     }}
                  >
                     {langueActual === 'fr' ? 'Recherche' : 'Hitady'}
                  </Text>
               ),
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'search'}
                     color={focused ? Colors.greenAvg : Colors.grey}
                     size={26}
                  />
               ),
               tabBarStyle: [
                  styles.tabBarStyles,
                  { display: isTabBarHide ? 'none' : 'flex' },
               ],
            }}
         />
         <Tab.Screen
            name="Favoris"
            component={Favoris}
            options={{
               tabBarLabel: ({ focused }) => (
                  <Text
                     style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: focused ? Colors.greenAvg : Colors.grey,
                     }}
                  >
                     {langueActual === 'fr' ? 'Favoris' : 'Ankafiziko'}
                  </Text>
               ),
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'favorite'}
                     color={focused ? Colors.greenAvg : Colors.grey}
                     size={26}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="About"
            component={About}
            options={{
               tabBarLabel: ({ focused }) => (
                  <Text
                     numberOfLines={1}
                     style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: focused ? Colors.greenAvg : Colors.grey,
                     }}
                  >
                     {langueActual === 'fr' ? 'A propos' : 'Mombamomba'}
                  </Text>
               ),
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'info'}
                     color={focused ? Colors.greenAvg : Colors.grey}
                     size={26}
                  />
               ),
            }}
         />
      </Tab.Navigator>
   );
}

const styles = StyleSheet.create({
   tabBarStyles: {
      position: 'absolute',
      borderRadius: 10,
      marginVertical: 10,
      backgroundColors: Colors.background,
      height: 60,
      padding: 5,
      marginHorizontal: 14,
   },
});
