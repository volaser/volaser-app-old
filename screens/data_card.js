import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";
import dateFormat from "dateformat";

import store from "./data_store";

export default class DataCard extends React.Component {
  delete(index) {
    store.delete({ index });
    this.props.navigation.navigate("DataTable");
  }

  render() {
    const { navigation } = this.props;
    const name = navigation.getParam("name", "<Name>");
    const index = navigation.getParam("index", "<INDEX>");
    const time = navigation.getParam("time", 0);
    const location = navigation.getParam("location", "<Location>");
    const range = navigation.getParam("range", "<RANGE>");
    return (
      <View>
        <Text h1>
          {index}:{name}{" "}
        </Text>
        <Text h3>{dateFormat(time)}</Text>
        <Text h4> {location.latitude} </Text>
        <Text h4> {location.longitude} </Text>
        <Text h3> Range: {range} </Text>
        <Button
          large
          rounded
          title="Delete"
          icon={{ name: "delete" }}
          backgroundColor="#ca343c"
          onPress={() => this.delete(index)}
        />
      </View>
    );
  }
}
