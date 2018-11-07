import React from "react";
import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";

import Measurements from "./measure";
import Data from "./data";
import Settings from "./settings";
import Developer from "./dev";
import Tutorial from "./tutorial";

export default class App extends React.Component {
  render() {
    return <RootStackNavigator />;
  }
}

const RootTabsNavigator = createMaterialTopTabNavigator(
  {
    Measurements: {
      screen: Measurements,
      navigationOptions: {
        title: "Measure",
        tabBarLabel: "Measure",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="build" type="material" size={28} color={tintColor} />
        )
      }
    },
    Data: {
      screen: Data,
      navigationOptions: {
        title: "Data",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="database"
            type="material-community"
            size={28}
            color={tintColor}
          />
        )
      }
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: "Settings",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="settings"
            type="material-community"
            size={28}
            color={tintColor}
          />
        )
      }
    },
    Developer: {
      screen: Developer,
      navigationOptions: {
        title: "Dev",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="developer-mode" color={tintColor} />
        )
      }
    }
  },
  {
    initialRouteName: "Measurements",
    navigationOptions: {
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#fff"
      }
    },
    tabBarPosition: "bottom",
    tabBarOptions: {
      showIcon: true,
      style: {
        backgroundColor: "#118ec6"
      },
      labelStyle: {
        fontSize: 12
      }
    }
  }
);

const RootStackNavigator = createStackNavigator(
  {
    Root: {
      screen: RootTabsNavigator
    },
    Tutorial: {
      screen: Tutorial
    }
  },
  {
    headerMode: "none"
  }
);
