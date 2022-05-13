/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Banner, Button, Title} from 'react-native-paper';
import {Supernova} from '@qlik/react-native-carbon';
import treemap from '@qlik-trial/sn-treemap';
import horizon from '@qlik-trial/sense-themes-default/dist/horizon/theme.json';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import galaxy from './galaxy.json';
import useConnectToApp from './useConnectToApp';

const App = () => {
  const connection = useConnectToApp(galaxy);
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <SafeAreaView style={styles.body}>
      <Banner
        style={styles.banner}
        visible={bannerVisible}
        actions={[{label: 'Hide', onPress: () => setBannerVisible(false)}]}>
        {`${connection.status} - ${connection.message}`}
      </Banner>
      {!bannerVisible ? (
        <Button onPress={() => setBannerVisible(true)}>Show</Button>
      ) : null}
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
  },
  supernova: {
    flex: 1,
  },
});

export default App;
