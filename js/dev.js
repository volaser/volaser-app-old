import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "react-native-elements";
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
            icon={{ name: "check-box" }}
            backgroundColor={usb.connected ? "#3a84fc" : "#999"}
            onPress={async () => {
              if (usb.connected) {
                let range = await laser.measure();
                let strength = await laser.strength();
                let mode = await laser.mode();
                logger.log(`Range: ${range} m`);
                logger.log(`Strength: ${strength}`);
                logger.log(`Mode: ${mode}`);
              }
            }}
          />
        </View>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 24, width: "75%" }}>
              Compass: {compass.angle}°
            </Text>
            <View
              style={{
                transform: [{ rotate: `${360 - compass.angle}deg` }]
              }}
            >
              <Icon name="location-arrow" type="font-awesome" size={48} />
            </View>
          </View>
          <Text style={{ fontSize: 24 }}>
            USB: {usb.connected ? "Connected" : "Disconnected"}{" "}
          </Text>
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
