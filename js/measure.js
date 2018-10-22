import React from "react";
import { View } from "react-native";
import { Icon, Button, FormInput, Text } from "react-native-elements";
import Area from "./area";
import { observer } from "mobx-react";

import motor from "./motor";
import laser from "./laser";
import store from "./data_store";
import { calculateArea } from "./calculate";
import styles from "./styles";

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
      outline: [],
      depth: 0.0
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
    const position = await this.getCurrentPosition();
    store.push({
      name: this.state.name,
      location: position.coords,
      time: Date(),
      depth: this.state.depth,
      area: calculateArea(this.state.outline),
      volume: calculateArea(this.state.outline) * this.state.depth,
      outline: this.state.outline
    });
  };

  measureArea = async () => {
    if (laser.ready) {
      let outline = await laser.measureOutline();
      outline = outline.filter(
        point => 0 < point["range"] && point["range"] < 20
      );
      this.setState({ outline: outline });
      console.log({ area: calculateArea(outline) });
    }
  };

  measureDepth = async () => {
    if (laser.ready) {
      const range = await laser.measureV();
      this.setState({ depth: range });
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
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
                title="Measure Depth"
                icon={{ name: "arrow-downward" }}
                backgroundColor={laser.ready ? "#386" : "#999"}
                onPress={async () => this.measureDepth()}
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
            <Text h4>Depth: {this.state.depth.toFixed(3)} m</Text>
            <Text h4>
              Area: {calculateArea(this.state.outline).toFixed(3)} m²
            </Text>
          </View>
          <Area
            points={this.state.outline}
            width="100%"
            height="30%"
            viewBox="-1.71 -4 8 8"
          />
        </View>
      </View>
    );
  }
}
