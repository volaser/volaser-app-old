import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import dateFormat from "dateformat";

import store from "./data_store";

export default class DataCard extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.name : "<Name>"
    };
  };

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
    const range = navigation.getParam("range", "<RANGE>");
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 6 }}>
          <Text>
            {"[" + index + "]"}:{name}
          </Text>
          <Text h3>{dateFormat(time)}</Text>
          <Text h4> {location.latitude} </Text>
          <Text h4> {location.longitude} </Text>
          <Text h3> Range: {range} (m)</Text>
        </View>
        <MapView
          style={styles.map}
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

        <Button
          rounded
          title="Delete"
          icon={{ name: "delete" }}
          backgroundColor="#ca343c"
          onPress={() => this.delete(index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 3
  }
});
