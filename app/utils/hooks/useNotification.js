import { useEffect } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
   }),
});

async function registerForPushNotificationsAsync() {
   let token;

   if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
         name: 'default',
         importance: Notifications.AndroidImportance.MAX,
         vibrationPattern: [0, 250, 250, 250],
         lightColor: '#FF231F7C',
      });
   }

   if (Device.isDevice) {
      const { status: existingStatus } =
         await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== 'granted') {
         ToastAndroid.show("Aloe n'a pas d'autorisation pour afficher des notifications.", ToastAndroid.SHORT);
         return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
   } else {
      ToastAndroid.show("Votre télephone ne supporte pas l'affichage des notifications.", ToastAndroid.SHORT);
   }

   return token;
}

export const useNotification = () => {
   useEffect(() => {
      registerForPushNotificationsAsync();
   }, []);

   return { registerForPushNotificationsAsync };
}
