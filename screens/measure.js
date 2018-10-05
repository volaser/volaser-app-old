import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Button, FormInput } from "react-native-elements";

import store from "react-native-simple-store";

import Laser from "../laser";

export default class Measurements extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Measure",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="build" type="material" size={28} color={tintColor} />
    ),
    tabBarColor: "#1155ee"
  };

  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  getGPS() {
    console.log("GPS!");
    console.log(this.state.name);
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("time: " + position.timestamp);
        console.log("date: " + Date(position.timestamp));
        console.log("lat: " + position.coords.latitude);
        console.log("lat: " + position.coords.longitude);
        store.push("data", {
          name: this.state.name,
          location: position.coords,
          time: position.timestamp
        });
      },
      error => {
        console.log("error: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Laser />
        <Button
          large
          rounded
          title="GPS"
          icon={{ name: "build" }}
          backgroundColor="#ca343c"
          onPress={() => this.getGPS()}
        />
        <FormInput
          placeholder="Name"
          containerStyle={styles.forminput}
          onChangeText={event => {
            this.setState({ name: event });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  forminput: {
    borderWidth: 1
  }
});
