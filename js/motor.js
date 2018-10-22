import { Platform, PermissionsAndroid } from "react-native";
import { observable } from "mobx";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";

const SERVICE_UUID = "1c228e6c-0907-4fa6-9fef-34103904da21";
const RX_UUID = "1dd9685e-bd8f-416b-bca2-0b0591709e64";

class Motor {
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
    console.log(`motor: ${message}`);
    this.statusMsg = message;
  }

  error(message) {
    console.log(`motor error: ${message}`);
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
    this.info("Requesting permissions to scan");
    await this.requestPermissions();
    this.info("Looking for Winch");
    this.manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        this.error(error.message);
      } else {
        if (device.name === "Volaser Winch") {
          this.info("Connecting to Winch");
          // this.manager.stopDeviceScan();
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
      } catch (error) {
        this.error(error);
        this.ready = false;
      }
    }
  };

  up() {
    this.sendBleMessage("U");
  }

  down() {
    this.sendBleMessage("D");
  }

  brake() {
    this.sendBleMessage("B");
  }
}

const motor = new Motor();
export default motor;
