import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { observer } from "mobx-react";

import laser from "./laser";
import usb from "./usb";
import logger, { Console } from "./logging";

import compass from "./compass";

@observer
export default class Developer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { log: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Button
            rounded
            title="Test Laser"
            icon={{ name: "arrow-forward" }}
            backgroundColor={usb.connected ? "#3a84fc" : "#999"}
            onPress={async () => {
              if (usb.connected) {
                let range = await laser.measure();
                logger.log(`Range: ${range}`);
              }
            }}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Text>Compass: {compass.angle} degrees</Text>
          <Text>USB: {usb.connected ? "Connected" : "Disconnected"} </Text>
        </View>
        <Console />
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
