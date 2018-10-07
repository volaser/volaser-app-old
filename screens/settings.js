import React from "react";
import { StyleSheet, View, Share } from "react-native";
import { Icon, Button } from "react-native-elements";

import store from "./data_store";

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
        <Button
          large
          rounded
          title="Export Data"
          backgroundColor="#337799"
          onPress={() =>
            Share.share({ message: JSON.stringify(store.list), title: "title" })
          }
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
