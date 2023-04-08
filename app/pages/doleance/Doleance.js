import { useState, useEffect, useRef } from 'react';
import {
   View,
   Text,
   Image,
   TextInput,
   SafeAreaView,
   ToastAndroid,
   TouchableOpacity,
} from 'react-native';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Input, Button } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import {
   insertOrUpdateToDBFunc,
   LoiService,
   checkAndsendMailFromLocalDBToAPI,
} from '_utils';

export default function Doleance({ navigation }) {
   //all datas
   const animation = useRef(null);
   const dispatch = useDispatch();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const isUserNetworkActive = useSelector(
      (selector) => selector.fonctionnality.isNetworkActive
   );
   const isUserConnectedToInternet = useSelector(
      (selector) => selector.fonctionnality.isConnectedToInternet
   );
   const [emailContent, setEmailContent] = useState({
      email: '',
      objet: '',
      message: '',
   });
   const [disabledButtonSend, setDisabledButtonSend] = useState(true);
   const [isLoadSendingMail, setIsLoadSendingMail] = useState(false);

   //all functions
   const showToastDoleance = (text) => {
      ToastAndroid.show(`${text}`, ToastAndroid.SHORT);
   };

   const sendMailToAPI = async (email, obj, message) => {
      LoiService.sendMailToServ(email, obj, message).then(() => {
         setIsLoadSendingMail(false);
      });
      return showToastDoleance(
         langueActual === 'fr'
            ? 'Votre mail a été bien et belle envoyé. Merci beaucoup.'
            : 'Lasa ny mailaka anao. Misaotra tompoko.'
      );
   };
   const sendMailToLocalDB = async (email, obj, message) => {
      let newMail = {
         email: email,
         objet: obj,
         contenu: message,
      };
      await insertOrUpdateToDBFunc('database', 'doleance', [newMail]);
      setIsLoadSendingMail(false);
      return showToastDoleance(
         "Comme vous n'avez pas de connexion, votre mail a été stocké et envoyer automatiquement plutard lorsque votre connexion est activé."
      );
   };

   const sendMail = () => {
      setIsLoadSendingMail(true);
      if (isUserNetworkActive && isUserConnectedToInternet) {
         console.log('mis connex iz d afk ');
         sendMailToAPI(
            emailContent.email,
            emailContent.objet,
            emailContent.message
         );
         setEmailContent({
            email: '',
            objet: '',
            message: '',
         });
      } else {
         console.log('tss connex e');
         sendMailToLocalDB(
            emailContent.email,
            emailContent.objet,
            emailContent.message
         );
         setEmailContent({
            email: '',
            objet: '',
            message: '',
         });
      }
   };

   const handleChangeEmailContent = (nameInput, text) => {
      switch (nameInput) {
         case 'email':
            setEmailContent({ ...emailContent, email: text });
            break;
         case 'objet':
            setEmailContent({ ...emailContent, objet: text });
            break;
         case 'message':
            setEmailContent({ ...emailContent, message: text });
            break;
         default:
            break;
      }
   };

   //all effect
   useEffect(() => {
      if (
         emailContent.email !== '' &&
         emailContent.objet !== '' &&
         emailContent.message !== ''
      ) {
         setDisabledButtonSend(false);
      } else {
         setDisabledButtonSend(true);
      }
   }, [emailContent]);

   useEffect(() => {
      if (isUserConnectedToInternet && isUserNetworkActive) {
         checkAndsendMailFromLocalDBToAPI();
      }
   }, [isUserNetworkActive, isUserConnectedToInternet]);

   return (
      <KeyboardAwareScrollView style={{ backgroundColor: Colors.background }}>
         <SafeAreaView>
            <View style={styles.view_container}>
               <View style={styles.head_banniere}>
                  <Lottie
                     autoPlay
                     ref={animation}
                     style={styles.banniere_image}
                     source={require('_images/mail.json')}
                  />
                  <Text
                     style={{
                        fontSize: 16,
                        color: Colors.redError,
                        marginVertical: 12,
                        textAlign: 'center',
                     }}
                  >
                     {langueActual === 'fr'
                        ? 'NB : Veuillez renseigner tous les champs de cette formulaire pour procéder à votre doléance!'
                        : "NB : Miangavy mba fenky daholo ny fampidiran-teny alohan'ny handefasanao ny fitarainanao."}
                  </Text>
               </View>
               <View style={styles.content_form}>
                  <Input
                     name="email"
                     value={emailContent.email}
                     placeholder={
                        langueActual === 'fr'
                           ? 'Votre adresse email : '
                           : 'Eto ny adiresy mailakao : '
                     }
                     leftIcon={
                        <Icon name="email" size={24} color={Colors.greenAvg} />
                     }
                     onChangeText={(text) =>
                        handleChangeEmailContent('email', text)
                     }
                  />
                  <Input
                     name="objet"
                     value={emailContent.objet}
                     placeholder={
                        langueActual === 'fr'
                           ? "Objet de l'email : "
                           : 'Foto-dresaka ny mailakao : '
                     }
                     onChangeText={(text) =>
                        handleChangeEmailContent('objet', text)
                     }
                     leftIcon={
                        <Icon name="title" size={24} color={Colors.greenAvg} />
                     }
                  />
                  <TextInput
                     name="message"
                     value={emailContent.message}
                     style={styles.champ_message}
                     placeholder={
                        langueActual === 'fr'
                           ? 'Votre message ici : '
                           : 'Ny hafatrao : '
                     }
                     multiline
                     onChangeText={(text) =>
                        handleChangeEmailContent('message', text)
                     }
                     numberOfLines={6}
                  />
                  <Button
                     title={langueActual === 'fr' ? 'Envoyer' : 'Alefa'}
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
                     disabled={disabledButtonSend}
                     onPress={() => sendMail()}
                     loading={isLoadSendingMail}
                  />
               </View>
            </View>
         </SafeAreaView>
      </KeyboardAwareScrollView>
   );
}
