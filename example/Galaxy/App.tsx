/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Supernova, SelectionsToolbar} from '@qlik/react-native-carbon';
import treemap from '@qlik/sn-treemap';
import snKpi from '@nebula.js/react-native-sn-kpi';
import horizon from '@qlik-trial/sense-themes-default/dist/horizon/theme.json';

import galaxy from './galaxy.json';
import useConnectToApp from './useConnectToApp';
import {Appbar} from 'react-native-paper';
import {useAtomValue} from 'jotai';
import {supernovaStateAtom} from '@qlik/react-native-carbon/src/carbonAtoms';

const App = () => {
  const supernovaState = useAtomValue(supernovaStateAtom);
  const connection = useConnectToApp(galaxy);
  const [display, setDisplay] = useState(true);

  const handleReload = () => {
    setDisplay(false);
    setTimeout(() => {
      setDisplay(true);
    }, 100);
  };
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
          <Appbar.Action icon="reload" onPress={handleReload} />
          <Appbar.Action icon="selection-off" onPress={handleClear} />
        </Appbar.Header>
        <View style={styles.modelView}>
          {connection.model && display ? (
            <Supernova
              sn={treemap}
              style={styles.supernova}
              app={connection.app}
              theme={horizon}
              showLegend={true}
              object={connection.model}
              appLayout={connection.appLayout}
              jsxComponent={true}
              disableSelections={true}
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
          onToggledLasso={(val: boolean) => supernovaState?.toggleLasso(val)}
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
    // borderWidth: 1,
    // width: '50%',
    // height: '10%',
    // alignSelf: 'center',
    // overflow: 'hidden',
    padding: 8,
    flex: 1,
  },
  supernova: {
    flex: 1,
  },
});

export default App;
