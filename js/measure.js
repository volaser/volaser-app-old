import React from "react";
import { View, Alert } from "react-native";
import { Button, FormInput, Text } from "react-native-elements";

import Area from "./area";
import { observer } from "mobx-react";

import compass from "./compass";
import usb from "./usb";
import laser from "./laser";
import logger from "./logging";
import store from "./data_store";
import settingsStore from "./settings_store";
import { calculateArea } from "./calculate";
import styles from "./styles";

@observer
export default class Measurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      location: null,
      areaOutline: [],
      dialogVisible: false,
      dialogHeight: 0.0,
      measuring: false
    };
  }

  getCurrentPosition = (
    options = { enableHighAccuracy: false, timeout: 2000, maximumAge: 60000 }
  ) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getLocation = async () => {
    const position = await this.getCurrentPosition();
    this.setState({ location: position.coords });
  };

  logMeasurement = async () => {
    let dataPoint = {
      name: this.state.name,
      location: this.state.location,
      time: Date(),
      areaOutline: this.state.areaOutline,
      area: calculateArea(this.state.areaOutline)
    };
    store.push(dataPoint);
    Alert.alert(
      "Data point saved",
      `Name: ${this.state.name}\nArea: ${calculateArea(
        this.state.areaOutline
      ).toFixed(2)} m²`,
      [{ text: "OK" }]
    );
  };

  startMeasureArea() {
    this.setState({ measuring: true, areaOutline: [] });
    this.interval = setInterval(() => {
      this.measureAreaPoint();
    }, 100);
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
      logger.log(point);
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
        title={"Measure Area"}
        icon={{ name: "settings-overscan" }}
        backgroundColor={usb.connected ? "#386" : "#999"}
        onPress={() => this.startMeasureArea()}
      />
    );

    const done = (
      <Button
        rounded
        title={"Done Measuring"}
        icon={{ name: "settings-overscan" }}
        backgroundColor={usb.connected ? "#836" : "#999"}
        onPress={() => this.stopMeasureArea()}
      />
    );

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <FormInput
              placeholder="Location Name"
              onFocus={event => this.setState({ name: "" })}
              onChangeText={event => {
                this.setState({ name: event });
              }}
            />
          </View>
          <View style={{ flexDirection: "row", flex: 3 }}>
            <View style={{ justifyContent: "space-between" }}>
              <Button
                rounded
                title="Save Measurement"
                icon={{ name: "loupe" }}
                backgroundColor="#55e"
                onPress={() => this.logMeasurement()}
              />
              {this.state.measuring ? done : measure}
            </View>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <Button
                rounded
                title="Start Tutorial"
                icon={{ name: "location-on" }}
                backgroundColor="#e55"
                onPress={() => this.props.navigation.navigate("Tutorial")}
              />
              <Button
                rounded
                title="Get Location"
                icon={{ name: "location-on" }}
                backgroundColor="#5a5"
                onPress={() => this.getLocation()}
              />
            </View>
          </View>
          <View style={{ padding: 20, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16 }}>
                  Area: {calculateArea(this.state.areaOutline).toFixed(2)} m²
                </Text>
                <Text>
                  {this.state.location == null
                    ? ""
                    : `GPS: ${this.state.location.latitude.toFixed(
                        3
                      )},${this.state.location.longitude.toFixed(3)}`}
                </Text>
              </View>
            </View>
          </View>
          <Area
            points={this.state.areaOutline}
            width="100%"
            height="30%"
            viewBox="-1.71 -4 8 8"
          />
        </View>
      </View>
    );
  }
}
