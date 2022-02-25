import {atomWithStorage} from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SettingsConfig = {
  apiKey?: string;
  baseUrl?: string;
  appId?: string;
  visId?: string;
};

const defaultSettings: SettingsConfig = {
  apiKey: undefined,
  baseUrl: undefined,
  appId: undefined,
  visId: undefined,
};

class AsyncStorageWrapper {
  static async getItem(key: string): Promise<SettingsConfig | undefined> {
    console.log('getting item', key);
    let config: SettingsConfig;
    try {
      const temp = await AsyncStorage.getItem(key);
      if (temp) {
        config = JSON.parse(temp);
        return config;
      }
    } catch (error) {
      console.log('failed to load', error);
    }
  }

  static async setItem(key: string, value: any): Promise<void> {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async removeItem(key: string): Promise<void> {
    return await AsyncStorage.removeItem(key);
  }
}

export const settingsAtom = atomWithStorage(
  '@config',
  defaultSettings,
  AsyncStorageWrapper,
);
