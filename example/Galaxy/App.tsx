/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Supernova, SelectionsToolbar} from '@qlik/react-native-carbon';
import treemap from '@qlik-trial/sn-treemap';
import horizon from '@qlik-trial/sense-themes-default/dist/horizon/theme.json';

import galaxy from './galaxy.json';
import useConnectToApp from './useConnectToApp';
import {Appbar} from 'react-native-paper';
import {useAtomValue} from 'jotai';
import {supernovaStateAtom} from '@qlik/react-native-carbon/src/carbonAtoms';

const App = () => {
  const supernovaState = useAtomValue(supernovaStateAtom);
  const connection = useConnectToApp(galaxy);
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
            />
          ) : null}
        </View>
        <SelectionsToolbar
          visible={supernovaState?.active}
          position={supernovaState?.position}
          icons={{confirm: 'check', cancel: 'close', clear: 'selection-off'}}
          onConfirm={() => supernovaState?.confirmSelection()}
          onCancel={() => supernovaState?.cancelSelection()}
          onClear={() => supernovaState?.clear()}
        />
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
