import {
   View,
   Text,
   Image,
   Linking,
   ScrollView,
   useWindowDimensions,
} from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '_theme/Colors';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import { Icon, Button } from '@rneui/base';

export default function Information() {
   //all states
   const [position, setPosition] = useState({ longitude: 0.0, latitude: 0.0 });
   const { width, height } = useWindowDimensions();
   const [errorMsgLocation, setErrorMsgLocation] = useState(null);

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
            <View style={styles.view_head_information}>
               <Image
                  source={require('_images/avg_logo.jpeg')}
                  style={{
                     width: 60,
                     height: 60,
                     borderRadius: 60,
                  }}
               />
               <View style={styles.info_header}>
                  <Text
                     style={{
                        fontWeight: 'bold',
                        fontSize: width < 370 ? 18 : 26,
                        color: Colors.greenAvg,
                     }}
                  >
                     Alliance Voahary Gasy
                  </Text>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                     <Icon name={'place'} color={Colors.black} size={20} />
                     <Text>Madagascar</Text>
                  </View>
               </View>
            </View>

            <MapView
               provider={PROVIDER_GOOGLE}
               style={[styles.map]}
               initialRegion={{
                  latitude: position.latitude,
                  longitude: position.longitude,
                  latitudeDelta: 70.2,
                  longitudeDelta: 1.15,
               }}
               showsUserLocation={true}
               userLocationAnnotationTitle={
                  langueActual === 'fr' ? 'Vous êtes ici' : 'Eto ianao'
               }
               followsUserLocation={true}
            >
               <Marker
                  key={'AVG'}
                  coordinate={{ latitude: -18.911, longitude: 47.54379 }}
                  title={langueActual === 'fr' ? 'AVG est ici' : 'Eto ny AVG'}
               />
            </MapView>

            <View style={styles.view_adresse}>
               <Text style={{ fontSize: 18, textDecorationLine: 'underline' }}>
                  {langueActual === 'fr' ? 'Adresses: ' : 'Adiresy'}
               </Text>
               <View>
                  <Text style={styles.txt_label}>
                     {langueActual === 'fr' ? 'SIEGE' : 'IVONTOERANA'}{' '}
                     ANTANANARIVO
                  </Text>
                  <Text style={styles.txt_value}>
                     Lot II Andrianarivo-Antananarivo 101-Madagascar
                  </Text>
               </View>

               <View>
                  <Text style={styles.txt_label}>
                     {langueActual === 'fr' ? 'BUREAU' : 'BIRAO'} REGIONAL BOENY
                  </Text>
                  <Text style={styles.txt_value}>
                     Studio n°2, 1er étage de l'Immeuble NY HAVANA, Rue
                     Paul-Mahajanga 401
                  </Text>
               </View>

               <View>
                  <Text style={styles.txt_label}>
                     {langueActual === 'fr' ? 'BUREAU' : 'BIRAO'} MORONDAVA
                  </Text>
                  <Text style={styles.txt_value}>
                     Andakabe-Immeuble NY HAVANA- Morondava 619
                  </Text>
               </View>

               <View>
                  <Text style={styles.txt_label}>
                     {langueActual === 'fr' ? 'BUREAU' : 'BIRAO'} MAROANTSETRA
                  </Text>
                  <Text style={styles.txt_value}>
                     Immeuble SAF FJKM Ankiakandrefana-Maroantsetra 512
                  </Text>
               </View>
            </View>

            <View style={styles.all_buttons_links}>
               <Button
                  title={langueActual === 'fr' ? 'Call (512)' : 'Antsoy (512)'}
                  icon={{
                     name: 'call',
                     type: 'material',
                     size: 24,
                     color: Colors.white,
                  }}
                  titleStyle={{ fontSize: 16 }}
                  buttonStyle={{
                     borderRadius: 15,
                     backgroundColor: Colors.greenAvg,
                  }}
                  containerStyle={{
                     width: 150,
                     marginVertical: 5,
                  }}
                  onPress={() => {
                     Linking.openURL('tel:512');
                  }}
               />
               <Button
                  title={langueActual === 'fr' ? 'Email' : 'Mailaka'}
                  icon={{
                     name: 'email',
                     type: 'material',
                     size: 24,
                     color: Colors.white,
                  }}
                  titleStyle={{ fontSize: 16 }}
                  buttonStyle={{
                     borderRadius: 15,
                     backgroundColor: Colors.greenAvg,
                  }}
                  containerStyle={{
                     width: 150,
                     marginVertical: 5,
                  }}
                  onPress={() => {
                     Linking.openURL(
                        'mailto:avg.communication@outlook.com?subject=Information'
                     );
                  }}
               />
            </View>

            <View
               style={[
                  styles.all_buttons_links,
                  { marginBottom: height < 700 ? 20 : 0 },
               ]}
            >
               <Button
                  title={'Facebook'}
                  icon={{
                     name: 'language',
                     type: 'material',
                     size: 24,
                     color: Colors.white,
                  }}
                  titleStyle={{ fontSize: 16 }}
                  buttonStyle={{
                     borderRadius: 15,
                     backgroundColor: Colors.greenAvg,
                  }}
                  containerStyle={{
                     width: 150,
                     marginVertical: 5,
                  }}
                  onPress={() => {
                     Linking.openURL(
                        'https://www.facebook.com/1968478726564976'
                     );
                  }}
               />
               <Button
                  title="Twitter"
                  icon={{
                     name: 'language',
                     type: 'material',
                     size: 24,
                     color: Colors.white,
                  }}
                  titleStyle={{ fontSize: 16 }}
                  buttonStyle={{
                     borderRadius: 15,
                     backgroundColor: Colors.greenAvg,
                  }}
                  containerStyle={{
                     width: 150,
                     marginVertical: 5,
                  }}
                  onPress={() => {
                     Linking.openURL('https://twitter.com/AllVoaharyGasy');
                  }}
               />
            </View>
         </View>
      </ScrollView>
   );
}
