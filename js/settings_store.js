import { action, observable } from "mobx";
import asyncStore from "react-native-simple-store";
import logger from "./logging";

class SettingsStore {
  @observable
  settings = {
    areaPoints: 20,
    groupLocations: false,
    probeOffset: 0.53,
    laserOffset: 0.02
  };

  constructor() {
    this.refreshSettings();
  }

  @action
  refreshSettings = async () => {
    try {
      const asyncStorage = await asyncStore.get("settings");
      if (asyncStorage != null) {
        this.settings = { ...this.settings, ...asyncStorage.settings };
      }
    } catch (err) {
      logger.log("Could not lad settings, using defaults: " + err);
    }
  };

  update(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    asyncStore.save("settings", { settings: this.settings });
  }
}

const settingsStore = new SettingsStore();
export default settingsStore;
