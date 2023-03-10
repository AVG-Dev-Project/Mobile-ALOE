import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import {useState, useEffect} from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '_theme/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles';
import { nameStackNavigation as nameNav } from '_utils';

export default function Information({ navigation }) {

   //all states
   const [position, setPosition] = useState({ longitude: 0.0, latitude: 0.0 });
   const [errorMsgLocation, setErrorMsgLocation] = useState(null);
   const dispatch = useDispatch();

   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );

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

   return (
      <ScrollView style={{ backgroundColor: Colors.background }}>
         <View style={styles.view_container}>
            {/*
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={[styles.map, StyleSheet.absoluteFillObject]}
                    initialRegion={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0021,
                    }}
                    showsUserLocation={true}
                    userLocationAnnotationTitle="AVG est ici"
                    followsUserLocation={true}
                >
                    <Marker
                        key={'AVG'}
                        coordinate={position}
                        title={"Emplacement de l'AVG"}
                    />
                </MapView>
            */}
         </View>
      </ScrollView>
   );
}
