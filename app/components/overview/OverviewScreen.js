import {
   View,
   StatusBar,
   SafeAreaView,
   useWindowDimensions,
   Text,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import { Colors } from '_theme/Colors';
import { widthPercentageToDP, heightPercentageToDP } from '_utils';

export default function OverviewScreen({ navigation, route }) {
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const { width } = useWindowDimensions();

   //all efects

   //all components

   return (
      <View style={styles.view_container}>
         <StatusBar backgroundColor={Colors.greenAvg} />
         <SafeAreaView style={styles.container_safe}>
            <Text>Coucou Dama</Text>
         </SafeAreaView>
      </View>
   );
}
