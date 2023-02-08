import { useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

export const useGetLocation = () => {
   //all states
   const [position, setPosition] = useState({ longitude: 0.0, latitude: 0.0 });
   const [errorMsgLocation, setErrorMsgLocation] = useState(null);

   //all effects
   useEffect(() => {
      (async () => {
         let { status } = await Location.requestForegroundPermissionsAsync();
         if (status !== 'granted') {
            return setErrorMsgLocation(
               'Permission pour accéder au position est refuser!'
            );
         }
         let location = await Location.getCurrentPositionAsync();
         setPosition({
            ...position,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
         });
      })();
   }, []);
   return { position, errorMsgLocation };
};
