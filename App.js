import { createStackNavigator } from 'react-navigation';
import Start from './src/screens/Start';
import Main from './src/screens/Main';

const App = createStackNavigator({
  Start: { screen: Start },
  Main: { screen: Main}
});

export default App;
