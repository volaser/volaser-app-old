import { Platform } from "react-native";
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

  scanAndConnect = async () => {
    this.info("Connecting to Laser");
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
      }
    }
  };

  measureRange = async () => {
    const range = await this.sendBleMessage("H");
    console.log(range);
    return range;
  };

  measureArea = async () => {
    if (this.device !== null) {
      angles = [
        0,
        18,
        36,
        54,
        72,
        90,
        108,
        126,
        144,
        162,
        180,
        198,
        216,
        234,
        252,
        270,
        288,
        306,
        324,
        342,
        0
      ];
      let ranges = [];
      for (let angle of angles) {
        let range = await this.sendBleMessage("R" + angle);
        ranges.push(range);
      }

      console.log("range1: " + ranges);

      navigator.geolocation.getCurrentPosition(
        position => {
          // store.push({
          //   name: this.state.name,
          //   location: position.coords,
          //   time: Date(),
          //   range: range
          // });
        },
        error => {
          console.log("error: " + error.message);
        },
        { enableHighAccuracy: true, timeout: 2000 }
      );
    }
  };
}

const laser = new Laser();
export default laser;
