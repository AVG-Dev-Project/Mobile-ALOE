import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Colors } from '_theme/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';

export default function About({ navigation }) {
   const dispatch = useDispatch();

   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );

   return (
      <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
         <View style={styles.view_container}>
            <View style={styles.head_banniere}>
               <Text
                  style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}
               >
                  {langueActual === 'fr' ? 'A propos' : 'Mombamomba'}
               </Text>
               <Image
                  style={styles.banniere_image}
                  source={require('_images/bg_loi.jpg')}
               />
               <Text
                  style={{
                     fontSize: 38,
                     fontWeight: 'bold',
                     marginVertical: 8,
                     color: Colors.violet,
                  }}
               >
                  LoIT
               </Text>
               <Text>
                  {langueActual === 'fr' ? 'Version' : 'Fanovana'} 1.0.0
               </Text>
            </View>

            <View style={styles.view_content_about}>
               <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                     alert(
                        langueActual === 'fr'
                           ? 'Politique de confidentialité'
                           : "Politika fiarovana fiainan'olona"
                     )
                  }
               >
                  <Text style={styles.button_link_about}>
                     {langueActual === 'fr'
                        ? 'Politique de confidentialité'
                        : "Politika fiarovana fiainan'olona"}
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
                     alert(
                        langueActual === 'fr'
                           ? 'Open Source Licences'
                           : "Lisansa ho an'ny rehetra"
                     )
                  }
               >
                  <Text
                     style={[
                        styles.button_link_about,
                        { borderBottomWidth: 1 },
                     ]}
                  >
                     {langueActual === 'fr'
                        ? 'Open Source Licences'
                        : "Lisansa ho an'ny rehetra"}
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
      </KeyboardAwareScrollView>
   );
}
