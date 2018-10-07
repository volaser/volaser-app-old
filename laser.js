import React from "react";
import { Platform, View } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Button, Text, FormInput } from "react-native-elements";

import { Buffer } from "buffer";

import store from "./screens/data_store";

export default class Laser extends React.Component {
  constructor() {
    super();
    this.state = {
      info: "",
      values: {},
      range: "",
      device: null,
      name: ""
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

  sendBleMessage = async message => {
    if (this.state.device !== null) {
      await this.state.device.writeCharacteristicWithResponseForService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
        "beb5483e-36e1-4688-b7f5-ea07361b26a8",
        Buffer.from("hello").toString("base64")
      );
      const characteristic = await this.state.device.readCharacteristicForService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
        "a812aeed-78d0-474a-b9b1-20a8a1f95463"
      );

      const range = Buffer.from(characteristic.value, "base64").toString(
        "ascii"
      );
      return range;
    }
  };

  measureRange = async () => {
    const range = await this.sendBleMessage("press");
    console.log("range: " + range);
    navigator.geolocation.getCurrentPosition(
      position => {
        store.push({
          name: this.state.name,
          location: position.coords,
          time: position.timestamp,
          range: range
        });
      },
      error => {
        console.log("error: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 2000 }
    );
  };

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info("Scanning...");
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
        <FormInput
          placeholder="Name"
          onFocus={event => this.setState({ name: "" })}
          onChangeText={event => {
            this.setState({ name: event });
          }}
        />
        <Text>Range: {this.state.range} m</Text>
        <Button
          large
          rounded
          title="Measure"
          icon={{ name: "build" }}
          backgroundColor={this.state.device !== null ? "#3a84fc" : "#555555"}
          onPress={() => this.measureRange()}
        />
        <Text>Info: {this.state.info}</Text>
      </View>
    );
  }
}
