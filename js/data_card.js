import React from "react";
import { View } from "react-native";
import Dialog from "react-native-dialog";
import { Text, Button } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import dateFormat from "dateformat";

import store from "./data_store";
import settingsStore from "./settings_store";
import styles from "./styles";
import Area from "./area";
import { calculateArea } from "./calculate";

import { observer } from "mobx-react";
@observer
export default class DataCard extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      title: params ? `[${params.index}] ${params.name}` : "<Name>",
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
      renameVisible: false,
      dialogName: ""
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
    const location = navigation.getParam("location", {
      latitude: 47.4182074,
      longitude: 8.505423
    });
    const emptyDepth = navigation.getParam("emptyDepth", 0.0);
    const probeDepth = navigation.getParam("probeDepth", 0.0);
    const probeHeight = navigation.getParam("probeHeight", 0.0);
    const areaOutline = navigation.getParam("areaOutline", []);
    const area = calculateArea(areaOutline);
    const emptyVolume = calculateArea(areaOutline) * emptyDepth;
    const sludgeVolume =
      calculateArea(areaOutline) *
      (probeHeight - probeDepth - settingsStore.settings.probeOffset);

    return (
      <View style={styles.container}>
        {/* <Dialog.Container visible={this.state.renameVisible}>
          <Dialog.Title>Rename {name}?</Dialog.Title>
          <Dialog.Input
            style={{ borderBottomWidth: 0.5 }}
            onChangeText={event => this.setState({ dialogName: event })}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => this.setState({ renameVisible: false })}
          />
          <Dialog.Button
            label="Submit"
            onPress={() =>
              this.setState({
                renameVisible: false
              })
            }
          />
        </Dialog.Container> */}

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
            <Text>{dateFormat(time)}</Text>
            <Text>
              GPS: {location.latitude},{location.longitude}
            </Text>

            <Text style={{ fontSize: 16 }}>
              Empty Depth: {emptyDepth.toFixed(3)} m
            </Text>
            <Text style={{ fontSize: 16 }}>
              Probe Depth: {probeDepth.toFixed(3)} m
            </Text>
            <Text style={{ fontSize: 16 }}>Area: {area.toFixed(3)} m²</Text>
            <Text style={{ fontSize: 16 }}>
              Probe Offset:{" "}
              {parseFloat(settingsStore.settings.probeOffset).toFixed(3)} m
            </Text>
            <Text style={{ fontSize: 16 }}>
              Empty Volume: {emptyVolume.toFixed(3)} m³
            </Text>
            <Text style={{ fontSize: 16 }}>
              Sludge Volume: {sludgeVolume.toFixed(3)} m³
            </Text>
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
              points={areaOutline}
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
