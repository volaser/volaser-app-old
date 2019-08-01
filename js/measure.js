import React from "react";
import { View, Alert } from "react-native";
import { Button, FormInput, Text } from "react-native-elements";
import DialogInput from "react-native-dialog-input";

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
      sludgeDepth: 0.0,
      bottomDepth: 0.0,
      nameDialogVisible: false,
      bottomDialogVisible: false,
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
    logger.log(
      `GPS location: ${position.coords.latitude.toFixed(
        1
      )}°N, ${position.coords.longitude.toFixed(1)}°E`
    );
    this.setState({ location: position.coords });
  };

  logMeasurement = async () => {
    let dataPoint = {
      name: this.state.name,
      location: this.state.location,
      time: Date(),
      areaOutline: this.state.areaOutline,
      area: calculateArea(this.state.areaOutline),
      sludgeDepth: this.state.sludgeDepth,
      bottomDepth: this.state.bottomDepth
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

  measureDepth = async () => {
    if (usb.connected) {
      const range = await laser.measure();
      if (range > 0) {
        logger.log(`Depth: ${range}`);
        this.setState({ sludgeDepth: range });
      }
    }
  };

  showNameDialog(visible) {
    this.setState({ nameDialogVisible: visible });
  }

  showBottomDialog(visible) {
    this.setState({ bottomDialogVisible: visible });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            height: "50%",
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginTop: "2%",
              marginBottom: "4%"
            }}
          >
            {/* <FormInput
              placeholder="Location Name"
              onFocus={event => this.setState({ name: "" })}
              onChangeText={event => {
                this.setState({ name: event });
              }}
              style={{ color: "black" }}
            /> */}
            <Text
              style={{
                fontSize: 24,
                backgroundColor: "#dfdfdf",
                paddingLeft: "5%",
                padding: "2%",
                color: this.state.name == "" ? "#aaa" : "black"
              }}
              onPress={() => this.showNameDialog(true)}
            >
              {this.state.name == "" ? "Location Name" : this.state.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              flex: 3
            }}
          >
            <View style={{ width: "50%", marginBottom: "2%" }}>
              {this.state.measuring ? (
                <Button
                  rounded
                  title={"Done"}
                  icon={{ name: "stop", type: "font-awesome" }}
                  backgroundColor={usb.connected ? "#836" : "#999"}
                  onPress={() => this.stopMeasureArea()}
                />
              ) : (
                <Button
                  rounded
                  title={"Measure Area"}
                  icon={{ name: "play", type: "font-awesome" }}
                  backgroundColor={usb.connected ? "#386" : "#999"}
                  onPress={() => this.startMeasureArea()}
                />
              )}
            </View>

            <View style={{ width: "50%", marginBottom: "2%" }}>
              <Button
                rounded
                title="Start Tutorial"
                icon={{ name: "question", type: "font-awesome" }}
                backgroundColor="rgb(223, 128, 128)"
                onPress={() => this.props.navigation.navigate("Tutorial")}
              />
            </View>

            <View style={{ width: "50%", marginBottom: "2%" }}>
              <Button
                rounded
                title="Save"
                width="50%"
                icon={{ name: "save" }}
                backgroundColor="rgb(40, 91, 187)"
                onPress={() => this.logMeasurement()}
              />
            </View>

            <View style={{ width: "50%", marginBottom: "2%" }}>
              <Button
                rounded
                title="Get Location"
                icon={{ name: "location-on" }}
                backgroundColor="rgb(197, 46, 190)"
                onPress={() => this.getLocation()}
              />
            </View>

            <View style={{ width: "50%", marginBottom: "2%" }}>
              <Button
                rounded
                titleProps={{ style: { fontSize: 5 } }}
                title="Measure Sludge"
                icon={{
                  name: "chevron-double-down",
                  type: "material-community"
                }}
                backgroundColor={usb.connected ? "#386" : "#999"}
                onPress={() => this.measureDepth()}
              />
            </View>

            <View style={{ width: "50%", marginBottom: "2%" }}>
              <Button
                rounded
                title="Record Depth"
                icon={{ name: "clipboard-check", type: "material-community" }}
                backgroundColor="rgb(50, 149, 206)"
                onPress={() => this.showBottomDialog(true)}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 14,
                width: "50%",
                paddingLeft: "4%"
              }}
            >
              Area: {calculateArea(this.state.areaOutline).toFixed(2)} m²
            </Text>
            <Text
              style={{
                fontSize: 14,
                width: "50%",
                paddingLeft: "4%"
              }}
            >
              {`Distance to sludge: ${this.state.sludgeDepth.toFixed(2)} m`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                width: "50%",
                paddingLeft: "4%"
              }}
            >
              {this.state.location == null
                ? "GPS:"
                : `GPS: ${this.state.location.latitude.toFixed(
                    1
                  )}°N, ${this.state.location.longitude.toFixed(1)}°E`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                width: "50%",
                paddingLeft: "4%"
              }}
            >
              {`Distance to bottom: ${this.state.bottomDepth.toFixed(2)} m`}
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

        <DialogInput
          isDialogVisible={
            this.state.nameDialogVisible &&
            this.state.nameDialogVisible != undefined
          }
          title={"Location Name"}
          message={
            "Please the name of the location you are surveying, so you can identify it in your records later."
          }
          hintInput={"Location Name"}
          submitInput={inputText => {
            this.setState({ name: inputText });
            this.showNameDialog(false);
          }}
          closeDialog={() => {
            this.showNameDialog(false);
          }}
        />

        <DialogInput
          isDialogVisible={
            this.state.bottomDialogVisible &&
            this.state.bottomDialogVisible != undefined
          }
          title={"Distance to bottom"}
          message={
            "Please enter the distance to the bottom of the containment as measured with the probe, in meters."
          }
          hintInput={this.state.bottomDepth.toFixed(2) + " m"}
          textInputProps={{ autoCorrect: false, clearTextOnFocus: true }}
          submitInput={inputText => {
            if (!isNaN(parseFloat(inputText))) {
              this.setState({ bottomDepth: parseFloat(inputText) });
            }
            this.showBottomDialog(false);
          }}
          closeDialog={() => {
            this.showBottomDialog(false);
          }}
        />
      </View>
    );
  }
}
