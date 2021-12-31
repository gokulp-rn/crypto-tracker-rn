import AsyncStorage from '@react-native-community/async-storage';

const cacheStorage = {
  getItem: async (key, shouldParse = true) => {
    const data = await AsyncStorage.getItem(key);
    if (typeof data === 'string' && shouldParse) {
      return JSON.parse(data);
    }
    return data;
  },
  setItem: async (key, value) => {
    let valueStr = value;
    if (typeof valueStr === 'object') {
      valueStr = JSON.stringify(value);
    }
    return AsyncStorage.setItem(key, valueStr);
  },
  removeItem: async key => AsyncStorage.removeItem(key),
};

export default cacheStorage;
