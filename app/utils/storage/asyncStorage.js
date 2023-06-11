import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoiService } from '../services/LoiService';

export const storeDataToLocalStorage = async (key, value) => {
   try {
      await AsyncStorage.setItem(`@${key}`, value);
   } catch (e) {
      return;
   }
};

export const storeFavoriteIdToLocalStorage = async (value) => {
   try {
      let valueString = JSON.stringify(value);
      await AsyncStorage.setItem(`@favorite`, valueString);
   } catch (e) {
      return;
   }
};

export const getFavoriteFromLocalStorage = async () => {
   try {
      const value = await AsyncStorage.getItem(`@favorite`);
      return JSON.parse(value);
   } catch (e) {
      return;
   }
};

export const getDataFromLocalStorage = async (key) => {
   try {
      const value = await AsyncStorage.getItem(`@${key}`);
      return value;
   } catch (e) {
      return;
   }
};

export const storeStatistiqueToLocalStorage = async () => {
   try {
      const res = await LoiService.fetchStatistiqueFromServ();
      if (res.article) {
         await AsyncStorage.setItem(
            `@articleTotalInServ`,
            JSON.stringify(res.article ?? 0)
         );
      }
      if (res.contenu) {
         await AsyncStorage.setItem(
            `@contenuTotalInServ`,
            JSON.stringify(res.contenu ?? 0)
         );
      }
   } catch (e) {
      return;
   }
};
