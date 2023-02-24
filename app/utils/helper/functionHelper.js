import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataToLocalStorage = async (key, value) => {
   try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`@${key}`, jsonValue);
   } catch (e) {
      console.log('error in function set async storage: ', e);
   }
};

export const getDataFromLocalStorage = async (key) => {
   try {
      const jsonValue = await AsyncStorage.getItem(`@${key}`);
      let value = jsonValue != null ? JSON.parse(jsonValue) : null;
      return value;
   } catch (e) {
      console.log('error in function get from async storage: ', e);
   }
};

export const removeInLocalStorage = async (key) => {
   //const keys = [key1, key2];
   try {
      await AsyncStorage.removeItem(key);
      //await AsyncStorage.multiRemove(keys);
   } catch (e) {
      console.log('error in function remove from async storage');
   }

   console.log('Remove done');
};
