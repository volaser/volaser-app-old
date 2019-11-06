import { observable } from "mobx";

import logger from "./logging";
import settingsStore from "./settings_store";
import usb from "./usb";

class Laser {
  info(message) {
    console.log(`laser: ${message}`);
    this.statusMsg = message;
  }

  error(message) {
    this.info(`Error: ${message}`);
  }

  measure = async () => {
    if (usb.connected) {
      const data = await usb.write("D\r\n");
      if (data > 1000) {
        logger.log(`Invalid laser measurement: ${parseInt(data)}`);
        return -1;
      } else {
        return parseFloat(data) / 100.0;
      }
    }
  };

  strength = async () => {
    if (usb.connected) {
      const data = await usb.write("S\r\n");
      return parseInt(data);
    }
  };

  mode = async () => {
    if (usb.connected) {
      const data = await usb.write("M\r\n");
      return parseInt(data);
    }
  };

  measureOutline = async () => {
    if (usb.connected) {
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
