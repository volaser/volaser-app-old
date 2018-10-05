import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";

import store from "react-native-simple-store";

export default class DataCard extends React.Component {
  delete(id) {
    store.get("data").then(result => {
      result.splice(id, 1);
      store.save("data", result);
    });
    this.props.navigation.navigate("DataTable", { deletedId: id });
  }

  render() {
    const { navigation } = this.props;
    const name = navigation.getParam("name", "<Name>");
    const id = navigation.getParam("key", "<ID>");
    const time = navigation.getParam("time", 0);
    const location = navigation.getParam("location", "<Location>");
    return (
      <View>
        <Text h1>
          {" "}
          {id}:{name}{" "}
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
          onPress={() => this.delete(id)}
        />
      </View>
    );
  }
}
