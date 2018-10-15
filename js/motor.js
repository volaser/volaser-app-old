import { Platform, View } from "react-native";
import { observable } from "mobx";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";

const SERVICE_UUID = "1c228e6c-0907-4fa6-9fef-34103904da21";
const RX_UUID = "1dd9685e-bd8f-416b-bca2-0b0591709e64";

class Motor {
  @observable
  statusMsg = "";
  device = null;

  constructor() {
    this.manager = new BleManager();

    if (Platform.OS === "ios") {
      this.manager.onStateChange(sate => {
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

  scanAndConnect = async () => {
    this.info("Connecting to Winch");
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
