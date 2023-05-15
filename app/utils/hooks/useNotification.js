import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
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
         alert('Failed to get push token for push notification!');
         return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
   } else {
      alert("Votre télephone ne supporte pas l'affichage des notifications.");
   }

   return token;
}

export default function useNotification() {
   /*const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();*/

   //all functions
   const schedulePushNotification = async (title, body, data) => {
      await Notifications.scheduleNotificationAsync({
         content: {
            title: title,
            body: body,
            data: { data: data ?? '' },
         },
         trigger: { seconds: 2 },
      });
   };

   useEffect(() => {
      registerForPushNotificationsAsync();

      /*notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };*/
   }, []);

   return { schedulePushNotification };
}
