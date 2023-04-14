import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Colors } from '_theme/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import { nameStackNavigation as nameNav } from '_utils';

export default function About({ navigation }) {
   const dispatch = useDispatch();

   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );

   return (
      <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
         <View style={styles.view_container}>
            <View style={styles.head_banniere}>
               <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
                  {langueActual === 'fr' ? 'A propos' : 'Mombamomba'}
               </Text>
               <Image
                  style={styles.banniere_image}
                  source={require('_images/aloe.png')}
               />
               <Text>
                  {langueActual === 'fr' ? 'Version' : 'Fanovana'} 1.0.0
               </Text>
            </View>

            <View style={styles.view_content_about}>
               <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                     navigation.navigate(nameNav.information, {
                        titleScreen:
                           langueActual === 'fr' ? 'Information' : 'Mombamomba',
                     })
                  }
               >
                  <Text style={styles.button_link_about}>
                     {langueActual === 'fr'
                        ? "A propos de l'AVG"
                        : "Mombamomban'ny AVG"}
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.6}>
                  <Text
                     style={styles.button_link_about}
                     onPress={() =>
                        alert(
                           langueActual === 'fr'
                              ? "Conditions d'utilisation"
                              : "Fepetran'ny fampiasana"
                        )
                     }
                  >
                     {langueActual === 'fr'
                        ? "Conditions d'utilisation"
                        : "Fepetran'ny fampiasana"}
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                     navigation.navigate(nameNav.doleance, {
                        titleScreen:
                           langueActual === 'fr' ? 'Doléance' : 'Fitarainana',
                     })
                  }
               >
                  <Text
                     style={[
                        styles.button_link_about,
                        { borderBottomWidth: 1 },
                     ]}
                  >
                     {langueActual === 'fr'
                        ? 'Envoyer doléance'
                        : 'Handefa fitarainana'}
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
      </KeyboardAwareScrollView>
   );
}
