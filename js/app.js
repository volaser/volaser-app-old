import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "react-navigation";

import Measurements from "./measure";
import Data from "./data";
import Settings from "./settings";

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return <RootTabsNavigator />;
  }
}

const RootTabsNavigator = createMaterialTopTabNavigator(
  {
    Measure: Measurements,
    Data: Data,
    Settings: Settings
  },
  {
    initialRouteName: "Measure",
    navigationOptions: {
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#fff"
      }
    },
    tabBarPosition: "bottom",
    tabBarOptions: {
      showIcon: true
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
