import React from "react";
import { View } from "react-native";
import Dialog from "react-native-dialog";
import { Text, List, ListItem, Slider } from "react-native-elements";

import styles from "./styles";
import { observer } from "mobx-react";

import settingsStore from "./settings_store";

export default class Settings extends React.Component {
  render() {
    return <SettingsList />;
  }
}

@observer
class SettingsList extends React.Component {
  render() {
    const settings = settingsStore.settings;
    return (
      <View style={styles.container}>
        <List>
          <SettingsItem
            slider
            maximum={2000}
            minimum={100}
            title="Measurement period"
            subtitle="This is the time in milliseconds between laser measurements"
            units="ms"
            value={settings.measurementPeriod}
            onChange={newVal =>
              settingsStore.update({ measurementPeriod: parseInt(newVal) })
            }
          />
        </List>
      </View>
    );
  }
}

class SettingsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      value: this.props.value
    };
  }

  render() {
    const units = this.props.units == null ? "" : ` (${this.props.units})`;
    let input = "";
    if (this.props.slider != undefined) {
      input = (
        <View style={{ justifyContent: "center" }}>
          <Slider
            minimumValue={this.props.minimum}
            maximumValue={this.props.maximum}
            value={this.state.value}
            onValueChange={value =>
              this.setState({ value: parseInt(value / 50) * 50 })
            }
          />
          <Text>Value: {this.state.value + this.props.units}</Text>
        </View>
      );
    } else {
      input = (
        <Dialog.Input
          style={{ borderBottomWidth: 0.5 }}
          placeholder={this.state.value.toString()}
          onChangeText={event => this.setState({ value: event })}
        />
      );
    }
    return (
      <View>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>{this.props.title}</Dialog.Title>
          <Dialog.Description>{this.props.subtitle}</Dialog.Description>
          {input}
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
          rightTitle={this.props.value + units}
          onPress={() => {
            this.setState({ dialogVisible: true, value: this.props.value });
          }}
        />
      </View>
    );
  }
}
