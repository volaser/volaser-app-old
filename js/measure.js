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
    logger.log(`getting location: ${position.coords.latitude}`);
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
    const period = settingsStore.settings.measurementPeriod;
    logger.log(`measurement period: ${period} ms`);
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
        icon={{ name: "play", type: "font-awesome" }}
        backgroundColor={usb.connected ? "#386" : "#999"}
        onPress={() => this.startMeasureArea()}
      />
    );

    const done = (
      <Button
        rounded
        title={"Done Measuring"}
        icon={{ name: "stop", type: "font-awesome" }}
        backgroundColor={usb.connected ? "#836" : "#999"}
        onPress={() => this.stopMeasureArea()}
      />
    );

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            height: "50%",
            backgroundColor: "white",
            padding: "5%"
          }}
        >
          <View style={{ flex: 1 }}>
            <FormInput
              placeholder="Location Name"
              onFocus={event => this.setState({ name: "" })}
              onChangeText={event => {
                this.setState({ name: event });
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              flex: 2
            }}
          >
            <View style={{ width: "50%", marginBottom: "5%" }}>
              {this.state.measuring ? done : measure}
            </View>

            <View style={{ width: "50%", marginBottom: "5%" }}>
              <Button
                rounded
                title="Get Location"
                icon={{ name: "location-on" }}
                backgroundColor="#5a5"
                onPress={() => this.getLocation()}
              />
            </View>

            <View style={{ width: "50%", marginBottom: "5%" }}>
              <Button
                rounded
                title="Save"
                width="50%"
                icon={{ name: "save" }}
                backgroundColor="#55e"
                onPress={() => this.logMeasurement()}
              />
            </View>

            <View style={{ width: "50%", marginBottom: "5%" }}>
              <Button
                rounded
                title="Start Tutorial"
                icon={{ name: "question", type: "font-awesome" }}
                backgroundColor="#e55"
                onPress={() => this.props.navigation.navigate("Tutorial")}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: 18, width: "50%", padding: "5%" }}>
              Area: {calculateArea(this.state.areaOutline).toFixed(2)} m²
            </Text>
            <Text style={{ fontSize: 16, width: "50%", padding: "5%" }}>
              {this.state.location == null
                ? "GPS:"
                : `GPS: ${this.state.location.latitude.toFixed(
                    1
                  )}°N, ${this.state.location.longitude.toFixed(1)}°E`}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: "50%",
            backgroundColor: "white"
          }}
        >
          <Area
            points={this.state.areaOutline}
            width="100%"
            height="100%"
            viewBox="-4 -4 8 8"
          />
        </View>
      </View>
    );
  }
}
