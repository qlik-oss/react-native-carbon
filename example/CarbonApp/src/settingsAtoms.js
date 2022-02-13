import {atomWithStorage} from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageWrapper {
  static async getItem(key) {
    console.log('getting item', key);
    try {
      const config = await AsyncStorage.getItem(key);
      console.log('config', config);
      return JSON.parse(config);
    } catch (error) {
      console.log('failed to load', error);
    }
  }

  static async setItem(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

export const settingsAtom = atomWithStorage(
  '@config',
  {apiKey: undefined},
  AsyncStorageWrapper,
);
