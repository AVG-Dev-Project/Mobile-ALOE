import { Icon } from '@rneui/base';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '_theme/Colors';
import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
} from 'react-native-popup-menu';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '_utils/redux/actions/action_creators';

const MenuOptionCustom = ({ text, icone }) => {
   return (
      <View
         style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
         }}
      >
         <Text style={{ fontSize: 22 }}>{text}</Text>
         <Icon name={icone} color={Colors.violet} size={20} />
      </View>
   );
};

export default function HeaderGlobal({ navigation }) {
   //all data
   const dispatch = useDispatch();

   //all logics
   const { t, i18n } = useTranslation();
   const onHandleChangeLanguage = (langue) => {
      i18n.changeLanguage(langue);
      dispatch(changeLanguage(langue));
   };

   return (
      <View style={styles.container}>
         <Text style={styles.titre_salutation}>
            {t('bienvenue_header_text')} !
         </Text>
         <TouchableOpacity activeOpacity={0.7}>
            <Menu>
               <MenuTrigger customStyles={{}}>
                  <Icon name={'widgets'} color={Colors.violet} size={34} />
               </MenuTrigger>
               <MenuOptions
                  customStyles={{
                     optionsContainer: {
                        padding: 8,
                     },
                     optionText: {
                        fontSize: 22,
                     },
                  }}
               >
                  <MenuOption onSelect={() => onHandleChangeLanguage('fr')}>
                     <MenuOptionCustom text="Français" icone="flag" />
                  </MenuOption>
                  <MenuOption onSelect={() => onHandleChangeLanguage('mg')}>
                     <MenuOptionCustom text="Malagasy" icone="flag" />
                  </MenuOption>
               </MenuOptions>
            </Menu>
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
