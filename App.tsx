import React from 'react';
import { createAppContainer } from 'react-navigation';
import Navigator from './react-src/components/Navigator';

const AppContainer = createAppContainer(Navigator);

export default class extends React.Component {
  render() {
    return <AppContainer />;
  }
}