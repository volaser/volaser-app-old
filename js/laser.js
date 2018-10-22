import { Platform, PermissionsAndroid } from "react-native";
import { BleManager } from "react-native-ble-plx";

import { Buffer } from "buffer";

import { observable } from "mobx";

import store from "./data_store";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const RX_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const TX_UUID = "a812aeed-78d0-474a-b9b1-20a8a1f95463";

class Laser {
  @observable
  statusMsg = "";
  @observable
  ready = false;
  device = null;

  constructor() {
    this.manager = new BleManager();
    if (Platform.OS === "ios") {
      this.manager.onStateChange(state => {
        if (state === "PoweredOn") this.scanAndConnect();
      });
    } else {
      this.scanAndConnect();
    }
  }

  info(message) {
    console.log(`laser: ${message}`);
    this.statusMsg = message;
  }

  error(message) {
    console.log(`laser error: ${message}`);
    this.statusMsg = `Error: ${message}`;
  }

  requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Location Permission",
          message:
            "Volaser needs access to your Location in order to scan for Bluetooth devices."
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permissions granted");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  scanAndConnect = async () => {
    await this.requestPermissions();
    this.info("Looking for Laser");
    this.manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        this.error(error.message);
      } else {
        if (device.name === "Volaser") {
          this.info("Connecting to Volaser");
          try {
            await device.connect();
            this.info("Discovering services and characteristics");
            this.device = await device.discoverAllServicesAndCharacteristics();
            this.info("Listening...");
            this.ready = true;
          } catch (error) {
            this.error(error);
          }
        }
      }
    });
  };

  sendBleMessage = async message => {
    if (this.device !== null) {
      try {
        await this.device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          RX_UUID,
          Buffer.from(message).toString("base64")
        );

        let characteristic = await this.device.readCharacteristicForService(
          SERVICE_UUID,
          TX_UUID
        );

        return Buffer.from(characteristic.value, "base64").toString("ascii");
      } catch (error) {
        this.error(error);
        this.ready = false;
      }
    }
  };

  measureH = async () => {
    const range = await this.sendBleMessage("H");
    console.log(range);
    return Number(range);
  };

  measureV = async () => {
    const range = await this.sendBleMessage("V");
    console.log(range);
    return Number(range);
  };

  measureOutline = async () => {
    if (this.device !== null) {
      N = 40;
      // const l = 4 + 1;
      angles = Array.from({ length: N + 1 }, (x, i) => i * (360 / N));
      let ranges = [];
      for (let angle of angles) {
        let msg = await this.sendBleMessage("R" + angle);
        let split_msg = msg.split(":");
        ranges.push({
          angle: Number(split_msg[0]),
          range: Number(split_msg[1])
        });
      }
      return ranges;
    }
  };
}

const laser = new Laser();
export default laser;
