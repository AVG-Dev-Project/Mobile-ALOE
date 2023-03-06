import {
   View,
   Text,
   Image,
   TextInput,
   SafeAreaView,
   TouchableOpacity,
} from 'react-native';
import { Colors } from '_theme/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Input, Button } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';

export default function Doleance({ navigation }) {
   const dispatch = useDispatch();

   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );

   return (
      <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
         <SafeAreaView>
            <View style={styles.view_container}>
               <View style={styles.head_banniere}>
                  <Image
                     style={styles.banniere_image}
                     source={require('_images/bg_loi.jpg')}
                  />
                  <Text
                     style={{
                        fontSize: 16,
                        color: Colors.redError,
                        marginVertical: 12,
                        textAlign: 'center',
                     }}
                  >
                     NB : Veuillez renseigner tous les champs de cette
                     formulaire pour procéder à votre doléance!
                  </Text>
               </View>
               <View style={styles.content_form}>
                  <Input
                     placeholder={'Votre adresse email : '}
                     leftIcon={
                        <Icon name="email" size={24} color={Colors.greenAvg} />
                     }
                  />
                  <Input
                     placeholder={"Objet de l'email : "}
                     leftIcon={
                        <Icon name="title" size={24} color={Colors.greenAvg} />
                     }
                  />
                  <TextInput
                     style={styles.champ_message}
                     placeholder={'Votre message ici : '}
                     multiline
                     numberOfLines={6}
                  />
                  <Button
                     title="Envoyer"
                     icon={{
                        name: 'send',
                        type: 'material',
                        size: 24,
                        color: Colors.white,
                     }}
                     titleStyle={{ fontSize: 24 }}
                     buttonStyle={{
                        borderRadius: 26,
                        backgroundColor: Colors.greenAvg,
                     }}
                     containerStyle={{
                        width: 160,
                        marginVertical: 12,
                     }}
                  />
               </View>
            </View>
         </SafeAreaView>
      </KeyboardAwareScrollView>
   );
}
