import React from "react";
import { ScrollView, View } from "react-native";
import Dialog from "react-native-dialog";
import { Icon, Text, List, ListItem, CheckBox } from "react-native-elements";

import styles from "./styles";
import { observer } from "mobx-react";

import settingsStore from "./settings_store";

export default class Settings extends React.Component {
  render() {
    return <SettingsList />;
  }
}
class SettingsList extends React.Component {
  render() {
    const settings = settingsStore.settings;
    return (
      <View style={styles.container}>
        <List>
          <SettingsItem
            title="Number of area points"
            subtitle="This is the number of points the laser takes when measuring area"
            value={settings.areaPoints}
            onChange={newVal => settingsStore.update({ areaPoints: newVal })}
          />

          <SettingsItem
            title="Probe offset"
            subtitle="This is the distance in meters between the probe reference point and the tip of the laser when in the home position."
            units="m"
            value={settings.probeOffset}
            onChange={newVal => settingsStore.update({ probeOffset: newVal })}
          />

          <SettingsItem
            title="Laser offset"
            subtitle="This is the distance in meters between the horizontal laser and the axis of rotation."
            units="m"
            value={settings.laserOffset}
            onChange={newVal => settingsStore.update({ laserOffset: newVal })}
          />

          {/* <ListItem
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
          /> */}
        </List>
      </View>
    );
  }
}

@observer
class SettingsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      value: this.props.value.toString()
    };
  }

  render() {
    const units = this.props.units == null ? "" : ` (${this.props.units})`;
    return (
      <View>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>{this.props.title}</Dialog.Title>
          <Dialog.Description>{this.props.subtitle}</Dialog.Description>
          <Dialog.Input
            style={{ borderBottomWidth: 0.5 }}
            onChangeText={event => this.setState({ value: event })}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => this.setState({ dialogVisible: false })}
          />
          <Dialog.Button
            label="Submit"
            onPress={() => {
              this.props.onChange(this.state.value.toString());
              this.setState({ dialogVisible: false });
            }}
          />
        </Dialog.Container>
        <ListItem
          title={this.props.title}
          rightTitle={this.state.value + units}
          onPress={() => {
            this.setState({ dialogVisible: true });
          }}
        />
      </View>
    );
  }
}
