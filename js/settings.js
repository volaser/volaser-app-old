import React from "react";
import { ScrollView } from "react-native";
import { Icon, Text, List, ListItem, CheckBox } from "react-native-elements";

import styles from "./styles";

import { observable } from "mobx";
import { observer } from "mobx-react";
@observer
export default class Settings extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <List>
          <ListItem
            title="Number of points per area scan"
            rightTitle={settingsStore.settings.areaPoints.toString()}
            leftIcon={{ name: "settings" }}
          />
          <ListItem
            title="Group data points by location"
            rightIcon={
              <CheckBox
                containerStyle={{
                  backgroundColor: "#fff",
                  padding: 0,
                  borderWidth: 0
                }}
                checked={settingsStore.settings.groupLocations}
                onPress={() =>
                  (settingsStore.settings.groupLocations = !settingsStore
                    .settings.groupLocations)
                }
              />
            }
          />
          <ListItem
            title="Probe Offset"
            // subtitle="Distance from the probe reference point to the laser in home position"
            rightTitle="0.53 m"
          />
        </List>
        <Text>Eawag 2018</Text>
      </ScrollView>
    );
  }
}

class SettingsStore {
  @observable
  settings = {
    areaPoints: 12,
    groupLocations: false,
    probeOffset: 0.53,
    laserOffset: 0.02
  };
}

const settingsStore = new SettingsStore();
export { settingsStore };
