import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

export default class Settings extends React.Component {
  static navigationOptions = {
    title: "Settings",
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="settings"
        type="material-community"
        size={28}
        color={tintColor}
      />
    )
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Settings </Text>
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
