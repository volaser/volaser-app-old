import { observable } from "mobx";
import RNSimpleCompass from "react-native-simple-compass";

class Compass {
  @observable
  angle = 0;

  constructor() {
    // Number of degrees changed before the callback is triggered
    const degree_update_rate = 1;
    RNSimpleCompass.start(degree_update_rate, angle => {
      this.angle = angle;
      RNSimpleCompass.stop();
    });
  }
}

const compass = new Compass();
export default compass;
