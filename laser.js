import React from "react";
import { Platform, View, Text } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Icon, Button } from "react-native-elements";
import { Buffer } from "buffer";

export default class Laser extends React.Component {
  constructor() {
    super();
    this.state = {
      info: "",
      values: {},
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

  async setupNotifications(device) {
    const service = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const characteristicW = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
    const characteristic = await device.writeCharacteristicWithResponseForService(
      service,
      characteristicW,
      Buffer.from("hello").toString("base64")
    );
  }

  sendBleMessage(message) {
    const service = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const characteristicW = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
    this.state.device.writeCharacteristicWithoutResponseForService(
      service,
      characteristicW,
      Buffer.from("hello").toString("base64")
    );
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info("Scanning...");
      console.log(device.name);
      if (error) {
        this.error(error.message);
        return;
      }

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
    });
  }

  render() {
    return (
      <View>
        <Button
          large
          rounded
          title="Measure"
          icon={{ name: "build" }}
          backgroundColor="#3a84fc"
          onPress={() => this.sendBleMessage("press")}
        />
        <Text>{this.state.info}</Text>
      </View>
    );
  }
}
