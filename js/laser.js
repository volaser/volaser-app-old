import { Buffer } from "buffer";

import { observable } from "mobx";

import logger from "./logging";
import settingsStore from "./settings_store";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const RX_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const TX_UUID = "a812aeed-78d0-474a-b9b1-20a8a1f95463";

class Laser {
  @observable
  statusMsg = "";
  @observable
  ready = false;
  device = null;

  info(message) {
    console.log(`laser: ${message}`);
    this.statusMsg = message;
  }

  error(message) {
    this.info(`Error: ${message}`);
  }

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
    return Number(range);
  };

  measureV = async () => {
    const range = await this.sendBleMessage("V");
    return Number(range);
  };

  enableRotation = async () => {
    await this.sendBleMessage("E");
  };

  disableRotation = async () => {
    await this.sendBleMessage("D");
  };

  measureOutline = async () => {
    if (this.device !== null) {
      N = parseInt(settingsStore.settings.areaPoints);
      // const l = 4 + 1;
      angles = Array.from({ length: N + 1 }, (x, i) => i * (360 / N));
      let ranges = [];
      await this.enableRotation();
      for (let angle of angles) {
        let msg = await this.sendBleMessage("R" + parseInt(angle));
        let split_msg = msg.split(":");
        ranges.push({
          angle: Number(split_msg[0]),
          range: Number(split_msg[1])
        });
        logger.log({
          angle: Number(split_msg[0]),
          range: Number(split_msg[1])
        });
      }
      await this.disableRotation();
      return ranges;
    }
  };
}

const laser = new Laser();
export default laser;
