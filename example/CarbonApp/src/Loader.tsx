import React from 'react';
import {ActivityIndicator} from 'react-native-paper';

const Loader = () => {
  // eslint-disable-next-line react-native/no-inline-styles
  return <ActivityIndicator size="large" style={{flex: 1}} />;
};

export default Loader;
