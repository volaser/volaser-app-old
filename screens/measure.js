import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, Button } from "react-native-elements";

export default class Measurements extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Measure",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="build" type="material" size={28} color={tintColor} />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      text: "Ready!"
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Measurements</Text>
        <Text>{this.state.text}</Text>
        <Button
          large
          rounded
          title="Measure"
          icon={{ name: "build" }}
          backgroundColor="#3a84fc"
        />
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
