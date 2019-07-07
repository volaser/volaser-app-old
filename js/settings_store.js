import { action, observable } from "mobx";
import asyncStore from "react-native-simple-store";
import logger from "./logging";

class SettingsStore {
  @observable
  settings = {
    measurementPeriod: 250
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
      logger.log("Could not load settings, using defaults: " + err);
    }
  };

  update(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    asyncStore.save("settings", { settings: this.settings });
  }
}

const settingsStore = new SettingsStore();
export default settingsStore;
