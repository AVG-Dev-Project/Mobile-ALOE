import { StyleSheet } from 'react-native';
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
   return (
      <Tab.Navigator
         initialRouteName="Home"
         screenOptions={{
            headerShown: false,
            tabBarInactiveTintColors: Colors.black,
            tabBarActiveTintColors: Colors.violet,
            tabBarLabelStyle: {
               fontSize: 13,
               textTransform: 'capitalize',
               fontWeight: 'bold',
               color: Colors.violet,
            },
            tabBarStyle: styles.tabBarStyles,
         }}
      >
         <Tab.Screen
            name="Home"
            component={Home}
            options={{
               tabBarLabel: langueActual === 'fr' ? 'Accueil' : 'Fandraisana',
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'home'}
                     color={focused ? Colors.violet : Colors.grey}
                     size={26}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Recherche"
            component={Recherche}
            options={{
               tabBarLabel: langueActual === 'fr' ? 'Recherche' : 'Hitady',
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'search'}
                     color={focused ? Colors.violet : Colors.grey}
                     size={26}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Favoris"
            component={Favoris}
            options={{
               tabBarLabel: langueActual === 'fr' ? 'Favoris' : 'Ankafiziko',
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'favorite'}
                     color={focused ? Colors.violet : Colors.grey}
                     size={26}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="A propos"
            component={About}
            options={{
               tabBarLabel: langueActual === 'fr' ? 'A propos' : 'Mombamomba',
               tabBarIcon: ({ focused }) => (
                  <Icon
                     name={'info'}
                     color={focused ? Colors.violet : Colors.grey}
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
      borderRadius: 20,
      marginVertical: 10,
      backgroundColors: Colors.background,
      height: 60,
      padding: 5,
      marginHorizontal: 30,
   },
});
