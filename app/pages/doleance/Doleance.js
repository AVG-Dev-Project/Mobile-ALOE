import { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Input, Button } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import { insertOrUpdateToDBFunc, LoiService } from '_utils';

export default function Doleance({ navigation }) {
   //all datas
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
         'Votre mail a été bien et belle envoyé. Merci beaucoup.'
      );
   };
   const sendMailToLocalDB = async (email, obj, message) => {
      let newMail = {
         email: email,
         objet: obj,
         message: message,
      };
      await insertOrUpdateToDBFunc('database', 'doleance', newMail);
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
                     name="email"
                     value={emailContent.email}
                     placeholder={'Votre adresse email : '}
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
                     placeholder={"Objet de l'email : "}
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
                     placeholder={'Votre message ici : '}
                     multiline
                     onChangeText={(text) =>
                        handleChangeEmailContent('message', text)
                     }
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
