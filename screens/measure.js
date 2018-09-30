import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

import Laser from "../laser";

export default class Measurements extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Measure",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="build" type="material" size={28} color={tintColor} />
    )
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Laser />
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
