import React from "react";
import { View } from "react-native";
import { Icon, Text, Button } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";

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
    let connected = false;
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
        <Text style={{ color: "#fff", marginTop: 20 }}>Laser:</Text>
        <Text style={{ color: "#fff", marginBottom: 20 }}>Winch:</Text>
        <Button
          rounded
          style={{ marginTop: 20, width: "50%" }}
          title="Reconnect"
          backgroundColor="#fff"
          color="#000"
          onPress={() => {}}
        />
      </View>
    );
  }
}
