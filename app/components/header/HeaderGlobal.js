import { Icon } from '@rneui/base';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '_theme/Colors';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '_utils/redux/actions/action_creators';

export default function HeaderGlobal({ navigation, bottomSheetRef }) {
   //all data
   const dispatch = useDispatch();

   //all logics
   const { t, i18n } = useTranslation();
   const onHandleChangeLanguage = (langue) => {
      i18n.changeLanguage(langue);
      dispatch(changeLanguage(langue));
   };

   const openBottomSheet = () => {
      //return bottomSheetRef.current.snapTo(1);
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
            <Icon name={'widgets'} color={Colors.greenAvg} size={34} />
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
});
