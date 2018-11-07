import { Platform, PermissionsAndroid } from "react-native";
import { BleManager, ScanMode } from "react-native-ble-plx";

import logger from "./logging";
import laser from "./laser";
import motor from "./motor";

class BLE {
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
        logger.log("Location permissions granted");
      } else {
        logger.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  scanAndConnect = async () => {
    await this.requestPermissions();
    devices = [];
    deviceIDs = [];
    pause = false;
    const timeout = ms => new Promise(res => setTimeout(res, ms));
    this.manager.stopDeviceScan();
    laser.info("Looking for Volaser...");
    motor.info("Looking for Winch...");
    this.manager.startDeviceScan(
      null,
      { scanMode: ScanMode.LowLatency },
      async (error, device) => {
        if (error) {
          logger.error(error.message);
        } else {
          if (!pause) {
            if (!devices.find(item => item.id == device.id)) {
              devices.push(device);
              logger.log({ id: device.id, name: device.name });
            }

            if (device.name === "Volaser") {
              pause = true;
              logger.log("Connecting to Volaser");
              laser.info("Connecting...");
              try {
                await timeout(750);
                await device.connect();
                logger.log("Discovering Volaser services and characteristics");
                laser.info("Discovering services and characteristics");
                laser.device = await device.discoverAllServicesAndCharacteristics();
                logger.log("Connected to Volaser");
                laser.info("Connected");
                laser.ready = true;
              } catch (error) {
                logger.error(error);
              }
              pause = false;
            } else if (device.name === "Volaser Winch") {
              pause = true;
              logger.log("Connecting to Winch");
              motor.info("Connecting...");
              try {
                await timeout(500);
                await device.connect();
                logger.log("Discovering Winch services and characteristics");
                motor.info("Discovering services and characteristics");
                motor.device = await device.discoverAllServicesAndCharacteristics();
                logger.log("Connected to Winch");
                motor.info("Connected");
                motor.ready = true;
              } catch (error) {
                logger.error(error);
              }
              pause = false;
            }
          }
        }
      }
    );
  };
}

const ble = new BLE();
export default ble;
