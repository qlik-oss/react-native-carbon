/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {enableCarbon} from '@qlik/react-native-carbon';
enableCarbon();

AppRegistry.registerComponent(appName, () => App);
