import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  DeviceEventEmitter
} from "react-native";
import { RNSerialport, definitions, actions } from "react-native-serialport";
import { observable } from "mobx";
import logger from "./logging";

class USB {
  @observable
  connected = false;
  @observable
  serviceStarted = false;
  @observable
  usbAttached = false;
  baudRate = "115200";
  interface = "-1";
  returnedDataType = definitions.RETURNED_DATA_TYPES.HEXSTRING;

  constructor() {
    this.startUSBListener = this.startUSBListener.bind(this);
    this.stopUSBListener = this.stopUSBListener.bind(this);

    this.startUSBListener();
  }

  startUSBListener() {
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STARTED,
      response => {
        logger.log("Started USB Service");
        this.serviceStarted = true;
        if (response.deviceAttached) {
          this.usbAttached = true;
        }
      },
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STOPPED,
      () => (this.serviceStarted = false),
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_ATTACHED,
      () => {
        logger.log("USB device attached");
        this.usbAttached = true;
      },
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_DETACHED,
      () => {
        logger.log("USB device detached");
        this.usbAttached = false;
      },
      this
    );
    DeviceEventEmitter.addListener(actions.ON_ERROR, this.onError, this);
    DeviceEventEmitter.addListener(
      actions.ON_CONNECTED,
      () => {
        this.connected = true;
      },
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_DISCONNECTED,
      () => {
        this.connected = false;
      },
      this
    );
    DeviceEventEmitter.addListener(actions.ON_READ_DATA, this.read, this);
    RNSerialport.setReturnedDataType(this.returnedDataType);
    RNSerialport.setAutoConnectBaudRate(parseInt(this.baudRate, 10));
    RNSerialport.setInterface(parseInt(this.interface, 10));
    RNSerialport.setAutoConnect(true);
    RNSerialport.startUsbService();
  }

  stopUSBListener = async () => {
    DeviceEventEmitter.removeAllListeners();
    const isOpen = await RNSerialport.isOpen();
    if (isOpen) {
      Alert.alert("isOpen", isOpen);
      RNSerialport.disconnect();
    }
    RNSerialport.stopUsbService();
  };

  onError(error) {
    logger.error(error);
  }

  read(data) {
    if (this.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY) {
      const payload = RNSerialport.intArrayToUtf16(data.payload);
      this.output = payload;
      logger.log({ usb: payload });
    } else if (
      this.returnedDataType === definitions.RETURNED_DATA_TYPES.HEXSTRING
    ) {
      const payload = RNSerialport.hexToUtf16(data.payload);
      this.output = payload;
      logger.log({ usb: payload });
    }
  }

  write(text) {
    RNSerialport.writeString(text);
  }
}

const usb = new USB();
export default usb;
