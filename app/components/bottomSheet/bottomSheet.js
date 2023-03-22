import React, { useEffect, useCallback } from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon } from '@rneui/themed';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { changeLanguage } from '_utils/redux/actions/action_creators';
import { Colors } from '_theme/Colors';

export default function BottomSheetCustom({ bottomSheetRef, snapPoints }) {
   const dispatch = useDispatch();
   const { i18n } = useTranslation();
   const { height } = useWindowDimensions();

   //all functions
   const onHandleChangeLanguage = (langue) => {
      i18n.changeLanguage(langue);
      dispatch(changeLanguage(langue));
   };

   //all efects
   useEffect(() => {
      bottomSheetRef.current.close();
   }, []);

   //components
   const renderBackDrop = useCallback(
      (props) => <BottomSheetBackdrop {...props} opacity={0.6} />,
      []
   );

   return (
      <BottomSheet
         ref={bottomSheetRef}
         backdropComponent={renderBackDrop}
         index={1}
         snapPoints={snapPoints}
         style={styles.view_bottom_sheet}
      >
         <View style={styles.view_in_bottomsheet}>
            <TouchableOpacity
               activeOpacity={0.4}
               style={styles.view_one_item_in_bottomsheet}
               onPress={() => {
                  onHandleChangeLanguage('fr');
                  bottomSheetRef.current.close();
               }}
            >
               <Icon name={'flag'} color={Colors.greenAvg} size={38} />
               <Text style={styles.text_bottomsheet}>Français</Text>
            </TouchableOpacity>
            <TouchableOpacity
               activeOpacity={0.4}
               style={styles.view_one_item_in_bottomsheet}
               onPress={() => {
                  onHandleChangeLanguage('mg');
                  bottomSheetRef.current.close();
               }}
            >
               <Icon name={'flag'} color={Colors.greenAvg} size={38} />
               <Text style={styles.text_bottomsheet}>Malagasy</Text>
            </TouchableOpacity>
         </View>
      </BottomSheet>
   );
}

const styles = StyleSheet.create({
   view_bottom_sheet: {
      marginHorizontal: 6,
   },
   view_in_bottomsheet: {
      paddingVertical: 10,
      display: 'flex',
      flex: 1,
   },
   view_one_item_in_bottomsheet: {
      height: 70,
      paddingHorizontal: 12,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: Colors.greenAvg,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
   },
   text_bottomsheet: {
      fontSize: 26,
      marginLeft: 13,
      fontWeight: 'bold',
   },
});
