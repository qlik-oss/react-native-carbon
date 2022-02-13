/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {useAtom} from 'jotai';
import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput, Button, Subheading} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {settingsAtom} from './settingsAtoms';

const SettingsScreen = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const navigation = useNavigation();

  const onChangeTenant = (value: string) => {
    setSettings({...settings, baseUrl: value});
  };

  const onChangeApiKey = (value: string) => {
    setSettings({...settings, apiKey: value});
  };

  const onChangeAppId = (value: string) => {
    setSettings({...settings, appId: value});
  };

  const onChangeVizId = (value: string) => {
    setSettings({...settings, visId: value});
  };

  const handleOnPress = () => {
    navigation.navigate('Model');
  };
  return (
    <SafeAreaView style={styles.body}>
      <Subheading style={{color: 'purple'}}>All fields mandatory</Subheading>
      <TextInput
        label="Tenant Url"
        value={settings?.baseUrl || ''}
        left={<TextInput.Affix text="https://" />}
        onChangeText={onChangeTenant}
      />
      <TextInput
        label="Api Key"
        value={settings?.apiKey || ''}
        onChangeText={onChangeApiKey}
      />
      <TextInput
        label="App Id"
        value={settings?.appId || ''}
        onChangeText={onChangeAppId}
      />
      <TextInput
        label="Viz Id"
        value={settings?.visId || ''}
        onChangeText={onChangeVizId}
      />
      <Button
        mode="contained"
        onPress={handleOnPress}
        disabled={
          !settings?.apiKey ||
          !settings.appId ||
          !settings.baseUrl ||
          !settings.visId
        }>
        Go
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    margin: 16,
  },
});

export default SettingsScreen;
