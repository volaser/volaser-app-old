import React from "react";
import { Platform, View } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Button, Text } from "react-native-elements";

import { Buffer } from "buffer";

export default class Laser extends React.Component {
  constructor() {
    super();
    this.state = {
      info: "",
      values: {},
      range: "",
      device: null
    };
    this.manager = new BleManager();
  }

  componentWillMount() {
    if (Platform.OS === "ios") {
      this.manager.onStateChange(state => {
        if (state === "PoweredOn") this.scanAndConnect();
      });
    } else {
      this.scanAndConnect();
    }
  }

  info(message) {
    this.setState({ info: message });
  }

  error(message) {
    this.setState({ info: "Error:" + message });
  }

  sendBleMessage(message) {
    this.state.device
      .writeCharacteristicWithResponseForService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
        "beb5483e-36e1-4688-b7f5-ea07361b26a8",
        Buffer.from("hello").toString("base64")
      )
      .then(() => {
        this.state.device
          .readCharacteristicForService(
            "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
            "a812aeed-78d0-474a-b9b1-20a8a1f95463"
          )
          .then(characteristic =>
            this.setState({
              range: Buffer.from(characteristic.value, "base64").toString(
                "ascii"
              )
            })
          );
      });
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info("Scanning...");
      // console.log(device.name);
      if (error) {
        this.error(error.message);
      } else {
        if (device.name === "Volaser") {
          this.info("Connecting to Volaser");
          this.manager.stopDeviceScan();
          device
            .connect()
            .then(device => {
              this.info("Discovering services and characteristics");
              return device.discoverAllServicesAndCharacteristics();
            })
            .then(
              device => {
                this.info("Listening...");
                this.setState({ device: device });
                // device
                //   .readCharacteristicForService(
                //     "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
                //     "a812aeed-78d0-474a-b9b1-20a8a1f95463"
                //   )
                //   .then(characteristic =>
                //     console.log(
                //       Buffer.from(characteristic.value, "base64").toString(
                //         "ascii"
                //       )
                //     )
                //   );
              },
              error => this.error(error.message)
            );
        }
      }
    });
  }

  render() {
    return (
      <View>
        <Text>Range: {this.state.range} m</Text>
        <Button
          large
          rounded
          title="Measure"
          icon={{ name: "build" }}
          backgroundColor="#3a84fc"
          onPress={() => this.sendBleMessage("press")}
        />
        <Text>Info: {this.state.info}</Text>
      </View>
    );
  }
}
