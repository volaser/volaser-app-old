import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import Modal from "react-native-modal";
import { Text, Button } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import dateFormat from "dateformat";

import store from "./data_store";
import styles from "./styles";
import Area from "./area";
import { calculateArea } from "./calculate";

export default class DataCard extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      title: params ? `${params.name}` : "<Name>",
      headerRight: (
        <Button
          rounded
          icon={{ name: "cloud-upload" }}
          title="Export"
          backgroundColor="#337799"
          onPress={() => store.export(navigation.getParam("index", null))}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      renameVisible: false
    };
  }

  delete(index) {
    store.delete({ index });
    this.props.navigation.navigate("DataTable");
  }

  render() {
    const { navigation } = this.props;
    const name = navigation.getParam("name", "<Name>");
    const index = navigation.getParam("index", "<INDEX>");
    const time = navigation.getParam("time", 0);
    const location = navigation.getParam("location", "<Location>");
    const depth = navigation.getParam("depth", 0.0);
    const outline = navigation.getParam("outline", []);
    const area = calculateArea(outline);
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          // visible={this.state.renameVisible}
          visible={false}
          style={{
            margin: 10,
            width: 300,
            height: 300
          }}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <View
            style={{
              flex: 1
            }}
          >
            <Text h3>Hello World!</Text>

            <TouchableHighlight
              onPress={() => {
                this.setState({ renameVisible: false });
              }}
            >
              <Text h2>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </Modal>

        <View style={{ flex: 6 }}>
          <View style={styles.row}>
            <Button
              rounded
              title="Rename"
              backgroundColor="#336699"
              onPress={() => this.setState({ renameVisible: true })}
            />
            <Button
              rounded
              title="Delete"
              icon={{ name: "delete" }}
              backgroundColor="#ca343c"
              onPress={() => this.delete(index)}
            />
          </View>
          <View style={{ margin: 20, alignItems: "flex-start" }}>
            <Text h4>{dateFormat(time)}</Text>
            <Text h4>
              GPS: {location.latitude},{location.longitude}
            </Text>
            <Text h3>Depth: {depth.toFixed(3)} m</Text>
            <Text h3>Area: {area.toFixed(3)} m²</Text>
            <Text h3>Volume: {(depth * area).toFixed(3)} m³</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", flex: 4 }}>
          <MapView
            style={{ flex: 1 }}
            zoomEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            showsScale={true}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              title={name}
            />
          </MapView>
          <View style={{ flex: 1 }}>
            <Area
              points={outline}
              width="100%"
              height="100%"
              viewBox="-3.75 -3.75 7.5 7.5"
            />
          </View>
        </View>
      </View>
    );
  }
}
