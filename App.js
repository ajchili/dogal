import { createStackNavigator } from 'react-navigation';
import Start from './src/screens/Start';

const App = createStackNavigator({
  Start: { screen: Start },
});

export default App;
