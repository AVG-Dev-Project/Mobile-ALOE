import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataToLocalStorage = async (key, value) => {
   try {
      await AsyncStorage.setItem(`@${key}`, value);
   } catch (e) {
      console.log('error in function set async storage: ', e);
   }
};

export const getDataFromLocalStorage = async (key) => {
   try {
      const value = await AsyncStorage.getItem(`@${key}`);
      return value;
   } catch (e) {
      console.log('error in function get from async storage: ', e);
   }
};

export const removeInLocalStorage = async (key) => {
   //const keys = [key1, key2];
   try {
      await AsyncStorage.removeItem(`@${key}`);
      //await AsyncStorage.multiRemove(keys);
   } catch (e) {
      console.log('error in function remove from async storage');
   }

   console.log('Remove done');
};

export const getAllKeys = async () => {
   let keys = [];
   try {
      keys = await AsyncStorage.getAllKeys();
      console.log('all keys : ', keys);
   } catch (e) {
      console.log('error in function get all keys : ', e);
   }
};
