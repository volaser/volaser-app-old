import React from "react";
import { createStackNavigator } from "react-navigation";
import { Icon } from "react-native-elements";
import DataTable from "./data_table";
import DataCard from "./data_card";

export default class Data extends React.Component {
  render() {
    return <DataStack />;
  }
}

const DataStack = createStackNavigator({
  DataTable: {
    screen: DataTable
  },
  DataCard: {
    screen: DataCard
  }
});
