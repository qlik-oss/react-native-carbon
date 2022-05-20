/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Supernova} from '@qlik/react-native-carbon';
import treemap from '@qlik-trial/sn-treemap';
import horizon from '@qlik-trial/sense-themes-default/dist/horizon/theme.json';

import galaxy from './galaxy.json';
import useConnectToApp from './useConnectToApp';
import {Appbar} from 'react-native-paper';

const App = () => {
  const connection = useConnectToApp(galaxy);
  console.log('connection', connection.app);

  const handleClear = useCallback(() => {
    connection.app?.clearAll();
  }, [connection]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.body} edges={['bottom', 'left', 'right']}>
        <Appbar.Header style={{elevation: 0, backgroundColor: 'white'}}>
          <Appbar.Content
            title="Your Chart"
            subtitle={`${connection.status} `}
          />
          <Appbar.Action icon="selection-off" onPress={handleClear} />
        </Appbar.Header>
        <View style={styles.modelView}>
          {connection.model ? (
            <Supernova
              sn={treemap}
              style={styles.supernova}
              app={connection.app}
              theme={horizon}
              showLegend={true}
              object={connection.model}
              selectionsToolbarIcons={{
                confirm: 'check',
                cancel: 'close',
                clear: 'selection-off',
              }}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  banner: {
    elevation: 4,
  },
  innerBanner: {
    color: 'white',
  },
  modelView: {
    flex: 1,
    margin: 2,
  },
  supernova: {
    flex: 1,
  },
});

export default App;
