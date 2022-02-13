/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  Text,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

import SettingsScreen from './src/SettingsScreen';
import ModelScreen from './src/ModelScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    accent: 'purple',
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <Suspense fallback={<Text>Loading</Text>}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Model" component={ModelScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Suspense>
    </PaperProvider>
  );
};

export default App;
