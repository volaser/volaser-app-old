import React from "react";
import { Icon } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";

export default class TutorialOnBoard extends React.Component {
  render() {
    return (
      <Onboarding
        onSkip={() => this.props.navigation.pop()}
        onDone={() => this.props.navigation.pop()}
        pages={[
          {
            title: "Welcome to the Eawag Volaser!",
            subtitle:
              "This tutorial will walk you through all the steps of measuring the volume of sludge in a holding tank",
            image: <Icon name="settings" color="#fff" size={192} />,
            backgroundColor: "#f77"
          },
          {
            backgroundColor: "#27f",
            image: <Icon name="bluetooth" color="#fff" size={192} />,
            title: "Connecting Bluetooth devices",
            subtitle:
              "Make sure that the both the laser unit and the motorized winch are powered on and in range"
          },
          {
            backgroundColor: "#999",
            image: <Icon name="android" color="#fff" size={48} />,
            title: "Measurement Complete",
            subtitle: "Press the check mark to save the measurement"
          }
        ]}
      />
    );
  }
}
