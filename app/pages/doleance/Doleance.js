import { useState, useEffect, useRef } from 'react';
import {
   View,
   Text,
   TextInput,
   SafeAreaView,
   Image,
   ToastAndroid,
} from 'react-native';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { useSelector } from 'react-redux';
import { Icon, Input, Button } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import {
   insertOrUpdateToDBFunc,
   LoiService,
   checkAndsendMailFromLocalDBToAPI,
   heightPercentageToDP,
} from '_utils';

export default function Doleance({ navigation }) {
   //all datas
   const animation = useRef(null);
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
            ? 'Votre doléance a bien été envoyée. Merci beaucoup.'
            : 'Nalefa ny fitarainanao. Misaotra tompoko.'
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
         "Comme vous n'avez pas accès à Internet, votre doléance est stocké et sera envoyer automatiquement plutard quand vous avezz accès à Internet."
      );
   };

   const sendMail = () => {
      setIsLoadSendingMail(true);
      if (isUserNetworkActive && isUserConnectedToInternet) {
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
      <KeyboardAwareScrollView
         enableOnAndroid={true}
         enableAutomaticScroll={Platform.OS === 'ios'}
         style={{ backgroundColor: Colors.background }}
      >
         <SafeAreaView>
            <View style={styles.view_container}>
               <View style={styles.head_banniere}>
                  <Image
                     style={styles.banniere_image}
                     source={require('_images/affiche512.png')}
                  />
                  <Text
                     style={{
                        fontSize: heightPercentageToDP(2),
                        color: Colors.redError,
                        textAlign: 'center',
                        marginTop: 8,
                     }}
                  >
                     {langueActual === 'fr'
                        ? 'Veuillez remplir tous les champs du présent formulaire pour déposer votre doléance.'
                        : 'Fenoy azafady ny saha rehetra mba hametrahana ny fitarainana.'}
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
                           ? 'Objet de doléance : '
                           : 'Foto-dresaka : '
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
