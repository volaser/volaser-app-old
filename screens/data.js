import React from "react";
import { createStackNavigator } from "react-navigation";
import { Icon } from "react-native-elements";
import DataTable from "./data_table";
import DataCard from "./data_card";

import store from "react-native-simple-store";

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

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", payload => {
      store.get("data").then(result => {
        this.setState({ data: result });
      });
    });
  }

  render() {
    return <DataStack screenProps={{ data: this.state.data }} />;
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
