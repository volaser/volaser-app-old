import { Platform, PermissionsAndroid } from "react-native";
import { observable } from "mobx";
import { Buffer } from "buffer";

const SERVICE_UUID = "1c228e6c-0907-4fa6-9fef-34103904da21";
const RX_UUID = "1dd9685e-bd8f-416b-bca2-0b0591709e64";

class Motor {
  @observable
  statusMsg = "";
  @observable
  ready = false;
  device = null;

  info(message) {
    console.log(`motor: ${message}`);
    this.statusMsg = message;
  }

  error(message) {
    console.log(`motor error: ${message}`);
    this.statusMsg = `Error: ${message}`;
  }

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
