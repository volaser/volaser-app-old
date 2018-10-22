import React from "react";
import { View, Alert } from "react-native";
import { Icon, Button, FormInput, Text } from "react-native-elements";
import Dialog from "react-native-dialog";

import Area from "./area";
import { observer } from "mobx-react";

import motor from "./motor";
import laser from "./laser";
import store from "./data_store";
import { calculateArea } from "./calculate";
import styles from "./styles";

export const probeOffset = 0.53;
@observer
export default class Measurements extends React.Component {
  static navigationOptions = {
    headerTitle: "Volaser",
    tabBarLabel: "Measure",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="build" type="material" size={28} color={tintColor} />
    ),
    tabBarColor: "#ff8ec6"
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      emptyDepth: 0.0,
      probeDepth: 0.0,
      probeHeight: 0.0,
      areaOutline: [],
      dialogVisible: false,
      dialogHeight: 0.0
    };
  }

  getCurrentPosition = (
    options = { enableHighAccuracy: false, timeout: 2000, maximumAge: 60000 }
  ) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  addLocation = async () => {
    const position = await this.getCurrentPosition();
    store.push({
      name: this.state.name,
      location: position.coords,
      time: Date()
    });
  };

  logVolume = async () => {
    let dataPoint = {
      name: this.state.name,
      time: Date(),
      probeHeight: this.state.probeHeight,
      emptyDepth: this.state.emptyDepth,
      probeDepth: this.state.probeDepth,
      areaOutline: this.state.areaOutline,
      area: calculateArea(this.state.areaOutline),
      emptyVolume:
        calculateArea(this.state.areaOutline) * this.state.emptyDepth,
      sludgeVolume:
        (this.state.probeHeight - this.state.probeDepth - probeOffset) *
        calculateArea(this.state.areaOutline)
    };
    try {
      const position = await this.getCurrentPosition();
      dataPoint.location = position.coords;
    } catch {
      console.log("timeout getting position");
    }
    store.push(dataPoint);
    Alert.alert(
      "Data point saved",
      `Name: ${this.state.name}\nEmpty Volume: ${calculateArea(
        this.state.outlareaOutlineine
      )}\nSludge Volume: ${(this.state.probeHeight -
        this.state.probeDepth -
        probeOffset) *
        calculateArea(this.state.areaOutline)}`,
      [{ text: "OK" }]
    );
  };

  measureArea = async () => {
    if (laser.ready) {
      let areaOutline = await laser.measureOutline();
      areaOutline = areaOutline.filter(
        point => 0 < point["range"] && point["range"] < 20
      );
      this.setState({ areaOutline: areaOutline });
      console.log({ area: calculateArea(areaOutline) });
    }
  };

  measureEmptyDepth = async () => {
    if (laser.ready) {
      const range = await laser.measureV();
      this.setState({ emptyDepth: range });
    }
  };

  measureProbeDepth = async () => {
    if (laser.ready) {
      const range = await laser.measureV();
      this.setState({ probeDepth: range });
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Probe Height</Dialog.Title>
          <Dialog.Description>
            Input the distance from the tip of the probe to the laser reference
            point:
          </Dialog.Description>
          <Dialog.Input
            label="Height (m):"
            style={{ borderBottomWidth: 0.5 }}
            onChangeText={event => this.setState({ dialogHeight: event })}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => this.setState({ dialogVisible: false })}
          />
          <Dialog.Button
            label="Submit"
            onPress={() =>
              this.setState({
                probeHeight: Number(this.state.dialogHeight),
                dialogVisible: false
              })
            }
          />
        </Dialog.Container>
        {/* <Header
          leftComponent={{ icon: "menu", color: "#fff" }}
          centerComponent={{ text: "Volaser", style: { color: "#fff" } }}
          rightComponent={{ icon: "home", color: "#fff" }}
        /> */}

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
                title="Log Volume"
                icon={{ name: "loupe" }}
                backgroundColor="#55e"
                onPress={() => this.logVolume()}
              />
              <Button
                rounded
                title="Probe Depth"
                icon={{ name: "arrow-downward" }}
                backgroundColor={laser.ready ? "#386" : "#999"}
                onPress={async () => this.measureProbeDepth()}
              />
              <Button
                rounded
                title="Empty Depth"
                icon={{ name: "arrow-downward" }}
                backgroundColor={laser.ready ? "#386" : "#999"}
                onPress={async () => this.measureEmptyDepth()}
              />
              <Button
                rounded
                title="Measure Area"
                icon={{ name: "settings-overscan" }}
                backgroundColor={laser.ready ? "#386" : "#999"}
                onPress={async () => this.measureArea()}
              />
            </View>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <Button
                rounded
                title="Add Location"
                icon={{ name: "location-on" }}
                backgroundColor="#e55"
                onPress={() => this.addLocation()}
              />
              <Button
                rounded
                small
                title={`Probe Height: ${this.state.probeHeight}`}
                backgroundColor="#299"
                onPress={async () => this.setState({ dialogVisible: true })}
              />
              <Button
                rounded
                backgroundColor={motor.ready ? "#38f" : "#999"}
                title="Up"
                icon={{ name: "keyboard-arrow-up" }}
                onPress={() => {}}
                onPressIn={() => motor.up()}
                onPressOut={() => motor.brake()}
              />
              <Button
                rounded
                backgroundColor={motor.ready ? "#38f" : "#999"}
                title="Down"
                icon={{ name: "keyboard-arrow-down" }}
                onPress={() => {}}
                onPressIn={() => motor.down()}
                onPressOut={() => motor.brake()}
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
                  Empty Depth: {this.state.emptyDepth.toFixed(3)} m
                </Text>
                <Text style={{ fontSize: 16 }}>
                  Area: {calculateArea(this.state.areaOutline).toFixed(3)} m²
                </Text>
                <Text style={{ fontSize: 16 }}>
                  Empty Volume:
                  {(
                    this.state.emptyDepth *
                    calculateArea(this.state.areaOutline)
                  ).toFixed(3)}
                  m³
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16 }}>
                  Probe Depth: {this.state.probeDepth.toFixed(3)} m
                </Text>
                <Text style={{ fontSize: 16 }}>
                  Probe Offset: {probeOffset} m
                </Text>
                <Text style={{ fontSize: 16 }}>
                  Sludge Volume:
                  {(
                    (this.state.probeHeight -
                      this.state.probeDepth -
                      probeOffset) *
                    calculateArea(this.state.areaOutline)
                  ).toFixed(3)}
                  m³
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