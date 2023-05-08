import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '_theme/Colors';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function HeaderGlobal({ bottomSheetRef }) {
   //all data

   //all logics
   const { t } = useTranslation();
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const openBottomSheet = () => {
      return bottomSheetRef.current?.present();
   };

   return (
      <View style={styles.container}>
         <Text style={styles.titre_salutation}>
            {t('bienvenue_header_text')} !
         </Text>
         <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => openBottomSheet()}
         >
            <Image
               style={styles.flagImg}
               source={
                  langueActual === 'fr'
                     ? require('_images/french.png')
                     : require('_images/malagasy.png')
               }
            />
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      marginVertical: 5,
      marginHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
   },
   titre_salutation: {
      color: Colors.black,
      fontSize: 26,
      fontWeight: 'bold',
   },
   flagImg: {
      height: 30,
      width: 30,
      borderRadius: 30,
   },
});
