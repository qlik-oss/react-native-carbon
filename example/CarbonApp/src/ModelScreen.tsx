import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import Loader from './Loader';
import useConnectToApp from './useConnectoToApp';
import {Supernova, SelectionsToolbar} from '@qlik/react-native-carbon';
import treemap from '@qlik-trial/sn-treemap';
import horizon from '@qlik-trial/sense-themes-default/dist/horizon/theme.json';
import {supernovaStateAtom} from '@qlik/react-native-carbon/src/carbonAtoms';
import {useAtom} from 'jotai';
import {useResetAtom} from 'jotai/utils';

const getSn = (type: string) => {
  switch (type) {
    case 'treemap':
    default:
      return treemap;
  }
};

const ModelScreen = () => {
  const connection = useConnectToApp();
  const [supernovaState] = useAtom(supernovaStateAtom);
  const resetSupernovaState = useResetAtom(supernovaStateAtom);

  const handleClearSelections = async () => {
    try {
      console.log(connection?.app.session);
      await connection?.app.clearAll();
      resetSupernovaState();
    } catch (error) {
      console.log(error);
    }
  };

  const onConfirm = () => {
    if (supernovaState) {
      supernovaState.confirmSelection();
    }
    resetSupernovaState();
  };

  const onCancel = () => {
    if (supernovaState) {
      supernovaState.cancelSelection();
    }
    resetSupernovaState();
  };

  const onClear = () => {
    if (supernovaState) {
      supernovaState.clear();
    }
  };

  const onToggledLasso = (lasso: boolean) => {
    if (supernovaState) {
      supernovaState.toggleLasso(lasso);
    }
  };

  const handleSuspend = async () => {
    const session = connection?.app.session;
    if (session) {
      if (session.suspendResume.isSuspended) {
        await session.resume();
      } else {
        await session.suspend();
      }
    }
  };
  return connection?.layout ? (
    <>
      <View style={styles.body}>
        <Supernova
          sn={getSn(connection?.layout?.visualization)}
          style={styles.supernova}
          app={connection.app}
          object={connection.model}
          loadLayout={connection.layout}
          theme={horizon}
          showLegend={true}
          // eslint-disable-next-line react-native/no-inline-styles
          titleBarStyle={{marginLeft: 96}}
        />
        <View style={styles.toolbar}>
          <IconButton icon="selection-off" onPress={handleClearSelections} />
          <IconButton icon="cloud-off-outline" onPress={handleSuspend} />
        </View>
      </View>
      <SelectionsToolbar
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClear={onClear}
        onToggledLasso={onToggledLasso}
        onDismiss={onCancel}
        offsetY={-56}
        icons={{confirm: 'check', cancel: 'close', clear: 'selection-off'}}
      />
    </>
  ) : (
    <Loader />
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
    margin: 4,
  },
  supernova: {
    flex: 1,
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
});

export default ModelScreen;
