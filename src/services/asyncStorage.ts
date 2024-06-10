import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  export const fetchData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return Promise.resolve(value)
    } catch (e) {
      // saving error
    }
  };

