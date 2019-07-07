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
    const areaOutline = navigation.getParam("areaOutline", []);
    const area = calculateArea(areaOutline);

    return (
      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <View style={{ margin: 20, alignItems: "flex-start" }}>
            <Text style={{ fontSize: 24 }}>{dateFormat(time)}</Text>
            <Text style={{ fontSize: 24 }}>
              {location == null
                ? ""
                : `GPS: ${location.latitude.toFixed(
                    3
                  )},${location.longitude.toFixed(3)}`}
            </Text>
            <Text style={{ fontSize: 24 }}>Area: {area.toFixed(3)} m²</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            rounded
            title="Delete"
            icon={{ name: "delete" }}
            backgroundColor="#ca343c"
            onPress={() => this.delete(index)}
          />
        </View>
        <View style={{ flexDirection: "row", flex: 4 }}>
          {location == null ? (
            <Text />
          ) : (
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
          )}
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
