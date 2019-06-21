import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { observer } from "mobx-react";

import laser from "./laser";
import logger, { Console } from "./logging";

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
            title="Measure H"
            icon={{ name: "arrow-forward" }}
            backgroundColor={laser.ready ? "#3a84fc" : "#999"}
            onPress={async () => {
              const range = await laser.measureH();
              logger.log(`Horizontal Range: ${range} (m)`);
            }}
          />
          <Button
            title="Measure V"
            icon={{ name: "arrow-downward" }}
            backgroundColor={laser.ready ? "#3a84fc" : "#999"}
            onPress={async () => {
              const range = await laser.measureV();
              logger.log(`Vertical Range: ${range} (m)`);
            }}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Text>Laser: {laser.statusMsg}</Text>
          <Text>Compass: </Text>
          <Text>USB: </Text>
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
