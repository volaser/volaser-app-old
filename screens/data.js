import React from "react";
import { createStackNavigator } from "react-navigation";
import { Icon } from "react-native-elements";
import DataTable from "./data_table";
import DataCard from "./data_card";

export default class DataExplorer extends React.Component {
  static navigationOptions = {
    title: "Data",
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="database"
        type="material-community"
        size={28}
        color={tintColor}
      />
    )
  };
  render() {
    return <DataStack />;
  }
}

const DataStack = createStackNavigator({
  DataTable: {
    screen: DataTable,
    navigationOptions: () => ({
      title: "Data",
      headerBackTitle: null
    })
  },
  DataCard: {
    screen: DataCard,
    navigationOptions: () => ({
      title: "Data",
      headerBackTitle: null
    })
  }
});
