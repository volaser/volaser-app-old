import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";

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
    return (
      <View>
        <Text h1>
          {" "}
          {index}:{name}{" "}
        </Text>
        <Text h3>{Date(time)}</Text>
        <Text h4> {location.latitude} </Text>
        <Text h4> {location.longitude} </Text>
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
