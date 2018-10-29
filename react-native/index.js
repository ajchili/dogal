/** @format */

import { AppRegistry, AsyncStorage } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

/**
 * Debug use ONLY.
 * Resets local storage to allow for new user creation.
 * Comment out to prevent clearing of local storage.
 */
// AsyncStorage.clear();

AppRegistry.registerComponent(appName, () => App);
