import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Button, Text } from "react-native-elements";
import { observer } from "mobx-react";

import laser from "./laser";
import motor from "./motor";

@observer
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
        <Text>{laser.statusMsg}</Text>
        <Text>{motor.statusMsg}</Text>
        <Button
          large
          raised
          backgroundColor="#38f"
          title="Up"
          icon={{ name: "arrow-upward" }}
          onPress={() => {}}
          onPressIn={() => motor.up()}
          onPressOut={() => motor.brake()}
        />
        <Button
          large
          raised
          backgroundColor="#38f"
          title="Down"
          icon={{ name: "arrow-downward" }}
          onPress={() => {}}
          onPressIn={() => motor.down()}
          onPressOut={() => motor.brake()}
        />
        <Text>Eawag 2018</Text>
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
