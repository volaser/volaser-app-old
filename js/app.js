import React from "react";
import { StyleSheet, PermissionsAndroid } from "react-native";
import { createMaterialTopTabNavigator } from "react-navigation";

import Measurements from "./measure";
import Data from "./data";
import Settings from "./settings";
import Developer from "./dev";

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
    // Settings: Settings,
    Developer: Developer
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
      showIcon: true,
      pressColor: "#ffaaaa",
      style: {
        backgroundColor: "#118ec6"
      }
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
