/**
 * @format
 */
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {enableCarbon} from '@qlik/react-native-carbon';
enableCarbon();

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#009845',
    accent: '#655DC6',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(Main));
