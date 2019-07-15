import React from "react";
import { View, Image } from "react-native";
import { Icon, Text, Button } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";
import Area from "./area";

import { observer } from "mobx-react";

import laser from "./laser";
import compass from "./compass";
import usb from "./usb";
import settingsStore from "./settings_store";

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
              "This tutorial will walk you through all the steps of measuring the cross sectional area of a holding tank.",
            image: (
              <Image
                resizeMode="contain"
                style={{
                  width: "80%",
                  height: "50%"
                }}
                source={require("./../img/eawag.png")}
              />
            )
          },
          {
            backgroundColor: "#rgb(204, 82, 112)",
            image: <CompassArrow />,
            title: "Calibrating Compass",
            subtitle:
              "Make sure that the phone compass is calibrated. Turn the phone in a circle: the compass arrow should always be facing the same direction. If it isn't, calibrate the compass by waving the phone several times in a figure 8, while turning in a circle."
          },
          {
            backgroundColor: "rgb(14, 131, 131)",
            image: <LaserPage />,
            title: "Connect the Laser",
            subtitle:
              "Connect the laser to the usb port. The phone will ask you to allow the volaser to connect. Once is it connected test that the range is reading a sensible value, and that the mode is 3."
          },
          {
            backgroundColor: "#rgb(240, 187, 13)",
            image: <AreaPage />,
            title: "Measure Tank Area",
            subtitle:
              "Insert the laser into the tank. Start the measurement, and begin turning the unit in a full circle to measure the entire area. Once you are done, stop the measurement."
          },
          {
            backgroundColor: "#118ec6",
            image: (
              <Image
                resizeMode="contain"
                style={{
                  width: "80%",
                  height: "50%"
                }}
                source={require("./../img/volaser_icon.png")}
              />
            ),
            title: "Happy Measurements!",
            subtitle: "Set forth and measure all the things."
          }
        ]}
      />
    );
  }
}

@observer
class CompassArrow extends React.Component {
  render() {
    return (
      <View
        style={{
          transform: [{ rotate: `${360 - compass.angle}deg` }]
        }}
      >
        <Icon
          name="location-arrow"
          type="font-awesome"
          size={96}
          color="white"
        />
      </View>
    );
  }
}

@observer
class LaserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: "",
      strength: "",
      mode: ""
    };
  }
  render() {
    return (
      <View
        style={{
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between"
        }}
      >
        <View style={{ marginBottom: "10%" }}>
          <Icon
            name={usb.connected ? "link" : "unlink"}
            type="font-awesome"
            color={usb.connected ? "#fff" : "#999"}
            size={96}
          />
        </View>
        <Button
          rounded
          style={{ marginTop: 20, width: "50%" }}
          title="Test Laser"
          backgroundColor={usb.connected ? "#fff" : "#999"}
          color={"black"}
          onPress={async () => {
            if (usb.connected) {
              let range = await laser.measure();
              let strength = await laser.strength();
              let mode = await laser.mode();
              this.setState({
                range: range,
                strength: strength,
                mode: mode
              });
            }
          }}
        />
        <Text style={{ color: "#fff", fontSize: 24, marginTop: "5%" }}>
          {`Range: ${this.state.range}${this.state.range != "" ? " m" : ""}`}
        </Text>
        <Text style={{ color: "#fff", fontSize: 24 }}>
          {`Strength: ${this.state.strength}`}
        </Text>
        <Text style={{ color: "#fff", fontSize: 24, marginBottom: "0%" }}>
          {`Mode: ${this.state.mode}`}
        </Text>
      </View>
    );
  }
}
@observer
class AreaPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaOutline: [],
      measuring: false
    };
  }

  startMeasureArea() {
    const period = settingsStore.settings.measurementPeriod;
    if (usb.connected) {
      this.setState({ measuring: true, areaOutline: [] });
      this.interval = setInterval(() => {
        this.measureAreaPoint();
      }, period);
    }
  }

  stopMeasureArea() {
    this.setState({ measuring: false });
    clearInterval(this.interval);
  }

  measureAreaPoint = async () => {
    if (usb.connected) {
      const angle = compass.angle;
      const range = await laser.measure();
      const point = await { angle: angle, range: range };
      if (range > 0) {
        this.setState(prevState => {
          return {
            areaOutline: [
              ...prevState.areaOutline.filter(point => point.angle != angle),
              point
            ].sort((a, b) => a.angle - b.angle)
          };
        });
      }
    }
  };

  render() {
    const measure = (
      <Button
        rounded
        title={"Start Measuring Area"}
        icon={{ name: "play", type: "font-awesome" }}
        backgroundColor={usb.connected ? "rgb(6, 141, 13)" : "#999"}
        onPress={() => this.startMeasureArea()}
      />
    );

    const done = (
      <Button
        rounded
        title={"Stop Measuring"}
        icon={{ name: "stop", type: "font-awesome" }}
        backgroundColor={usb.connected ? "rgb(141, 27, 6)" : "#999"}
        onPress={() => this.stopMeasureArea()}
      />
    );
    return (
      <View
        style={{
          alignItems: "center",
          width: "80%",
          height: "80%",
          justifyContent: "space-between",
          marginBottom: "-50%"
        }}
      >
        <View
          style={{
            height: "100%",
            backgroundColor: "white",
            marginBottom: "5%"
          }}
        >
          <Area
            points={this.state.areaOutline}
            width="100%"
            height="100%"
            viewBox="-4 -4 8 8"
          />
        </View>

        {this.state.measuring ? done : measure}
      </View>
    );
  }
}
