import React from "react";
import { Header } from "react-navigation";
import { StyleSheet, View } from "react-native";
import { Icon, Button, FormInput, Text } from "react-native-elements";
import { observer } from "mobx-react";

import laser from "./laser";
import motor from "./motor";
import store from "./data_store";

@observer
export default class Measurements extends React.Component {
  static navigationOptions = {
    headerTitle: "Volaser",
    tabBarLabel: "Measure",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="build" type="material" size={28} color={tintColor} />
    ),
    tabBarColor: "#1155ee"
  };

  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  log = async () => {
    if (laser.ready) {
      const range = await laser.measureRange();
      navigator.geolocation.getCurrentPosition(
        position => {
          store.push({
            name: this.state.name,
            location: position.coords,
            time: Date(),
            range: range
          });
        },
        error => {
          console.log("error: " + error.message);
        },
        { enableHighAccuracy: true, timeout: 2000 }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <FormInput
          placeholder="Name"
          onFocus={event => this.setState({ name: "" })}
          onChangeText={event => {
            this.setState({ name: event });
          }}
        />
        <Button
          large
          rounded
          title="Measure"
          icon={{ name: "build" }}
          backgroundColor={laser.ready ? "#3a84fc" : "#555555"}
          onPress={async () => this.log()}
        />
        <Text>{laser.statusMsg}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});
