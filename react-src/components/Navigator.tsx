import { createStackNavigator } from "react-navigation-stack";
import AppScreen from "../screens/Demo";

export default createStackNavigator({
  Demo: {
    screen: AppScreen,
    path: "/demo",
    navigationOptions: () => ({
      title: "Demo"
    })
  }
}, {});