import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Icon, Text, Button } from "react-native-elements";
import { observer } from "mobx-react";

import laser from "./laser";
import motor from "./motor";
@observer
export default class Developer extends React.Component {
  static navigationOptions = {
    title: "DEV",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="developer-mode" color={tintColor} />
    )
  };

  constructor(props) {
    super(props);
    this.state = { log: "" };
  }

  log(message) {
    this.setState((prevState, props) => {
      return {
        log: prevState.log + "\n" + message
      };
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Button
            title="Measure H"
            icon={{ name: "arrow-forward" }}
            backgroundColor={laser.ready ? "#3a84fc" : "#555555"}
            onPress={async () => {
              const range = await laser.measureH();
              this.log(`Vertical Range: ${range} (m)`);
            }}
          />
          <Button
            title="Measure V"
            icon={{ name: "arrow-downward" }}
            backgroundColor={laser.ready ? "#3a84fc" : "#555555"}
            onPress={async () => {
              const range = await laser.measureV();
              this.log(`Vertical Range: ${range} (m)`);
            }}
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Measure Area"
            icon={{ name: "album" }}
            backgroundColor={laser.ready ? "#3aac64" : "#555555"}
            onPress={async () => {
              const area = await laser.measureArea();
              this.log(`Area: ${area}`);
            }}
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Force Reconnect"
            backgroundColor="#355555"
            onPress={() => laser.scanAndConnect()}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Text>Laser: {laser.statusMsg}</Text>
          <Text>Motor: {motor.statusMsg}</Text>
        </View>
        <ScrollView>
          <Text style={{ flex: 1, padding: 20 }}>{this.state.log}</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  row: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center"
  }
});
