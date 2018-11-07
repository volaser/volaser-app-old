import React from "react";
import { View } from "react-native";
import { Icon, Text, Button } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";

import ble from "./ble";
import laser from "./laser";
import motor from "./motor";
import { observer } from "mobx-react";

export default class TutorialOnBoard extends React.Component {
  render() {
    return (
      <Onboarding
        onSkip={() => this.props.navigation.pop()}
        onDone={() => this.props.navigation.pop()}
        pages={[
          {
            backgroundColor: "#118ec6",
            title: "Welcome to the Eawag Volaser!",
            subtitle:
              "This tutorial will walk you through all the steps of measuring the volume of sludge in a holding tank",
            image: <Icon name="mood" color="#fff" size={96} />
          },
          {
            backgroundColor: "#27f",
            image: <BluetoothPage />,
            title: "Connecting Bluetooth devices",
            subtitle:
              "Make sure that the both the laser unit and the motorized winch are powered on and in range. Press Next when both are connected."
          },
          {
            backgroundColor: "#2b5",
            image: <Icon name="music-note" color="#fff" size={96} />,
            title: "Measure Tank Depth",
            subtitle:
              "Insert the probe until it reaches the bottom of the tank. Enter the distance measured from the bottom of the tank to the reference point"
          },
          {
            backgroundColor: "#f77",
            image: <SludgeDepth />,
            title: "Measure Sludge Depth",
            subtitle:
              "Move the laser head to the home position and measure the depth to the sludge."
          },
          {
            backgroundColor: "#176",
            image: <Icon name="palette" color="#fff" size={96} />,
            title: "Measure the Tank Height",
            subtitle:
              "Move the laser head to the top of the holding tank and measure the depth to the sludge."
          },
          {
            backgroundColor: "#f77",
            title: "Measure the Tank Area",
            image: <Icon name="loop" color="#fff" size={96} />,
            subtitle:
              "Move the laser head to the inside of the holding tank and measure the area."
          },
          {
            backgroundColor: "#118ec6",
            image: <Icon name="playlist-add-check" color="#fff" size={96} />,
            title: "Measurement Complete",
            subtitle: "Press the check mark to save the measurement"
          }
        ]}
      />
    );
  }
}
@observer
class BluetoothPage extends React.Component {
  render() {
    let connected = laser.ready && motor.ready;
    return (
      <View
        style={{
          alignItems: "center",
          width: "100%",
          justifyContent: "space-around"
        }}
      >
        <Icon
          name={connected ? "bluetooth-connected" : "bluetooth-disabled"}
          type="material"
          color={connected ? "#fff" : "#aaa"}
          size={96}
        />
        <Text style={{ color: "#fff", marginTop: 20 }}>
          Laser: {laser.statusMsg}
        </Text>
        <Text style={{ color: "#fff", marginBottom: 20 }}>
          Winch: {motor.statusMsg}
        </Text>
        <Button
          rounded
          style={{ marginTop: 20, width: "50%" }}
          title="Reconnect"
          backgroundColor="#fff"
          color="#000"
          onPress={() => ble.scanAndConnect()}
        />
      </View>
    );
  }
}

@observer
class SludgeDepth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      probeDepth: 0
    };
  }
  measureProbeDepth = async () => {
    if (laser.ready) {
      const range = await laser.measureV();
      this.setState({ sludgeDepth: range });
    }
  };
  render() {
    return (
      <View
        style={{
          alignItems: "center"
        }}
      >
        <Icon name="get-app" type="material" color="#fff" size={96} />
        <Text style={{ color: "#fff", marginBottom: 20 }}>
          Sludge Depth: {this.state.sludgeDepth} (m)
        </Text>
        <View
          style={{
            height: 150,
            justifyContent: "space-between"
          }}
        >
          <Button
            rounded
            title="Probe Depth"
            icon={{ name: "arrow-downward" }}
            backgroundColor={laser.ready ? "#fff" : "#999"}
            color="#000"
            onPress={async () => this.measureProbeDepth()}
          />
          <Button
            rounded
            backgroundColor={motor.ready ? "#fff" : "#999"}
            color="#000"
            title="Move Up"
            icon={{ name: "keyboard-arrow-up", color: "#000" }}
            onPress={() => {}}
            onPressIn={() => motor.up()}
            onPressOut={() => motor.brake()}
          />
          <Button
            rounded
            backgroundColor={motor.ready ? "#fff" : "#999"}
            color="#000"
            title="Move Down"
            icon={{ name: "keyboard-arrow-down", color: "#000" }}
            onPress={() => {}}
            onPressIn={() => motor.down()}
            onPressOut={() => motor.brake()}
          />
        </View>
      </View>
    );
  }
}
