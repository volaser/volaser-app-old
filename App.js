import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "react-navigation";

import Measurements from "./screens/measure";
import DataExplorer from "./screens/data";
import Settings from "./screens/settings";

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
    DataExplorer: DataExplorer,
    Settings: Settings
  },
  {
    initialRouteName: "Measure",
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
