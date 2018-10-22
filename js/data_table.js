import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List, ListItem, Button } from "react-native-elements";
import { observer } from "mobx-react";
import dateFormat from "dateformat";

import store from "./data_store";
import { calculateArea } from "./calculate";

import { probeOffset } from "./measure";

@observer
export default class DataTable extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Data",
      headerRight: (
        <Button
          rounded
          icon={{ name: "cloud-upload" }}
          title="Export All Data"
          backgroundColor="#337799"
          onPress={() => store.export()}
        />
      )
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    data = store.list;
    const list_obj = (
      <List>
        {data.map((elem, key) => (
          <ListItem
            key={key}
            title={elem.item.name}
            subtitle={`${dateFormat(elem.item.time, "mmm d, HH:MM")},  ${(
              calculateArea(elem.item.outline) *
              (elem.item.probeHeight - elem.item.probeDepth - probeOffset)
            ).toFixed(3)} m³`}
            onPress={() =>
              this.props.navigation.navigate("DataCard", {
                ...elem.item,
                index: elem.index
              })
            }
          />
        ))}
      </List>
    );
    return <ScrollView style={styles.container}>{list_obj}</ScrollView>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
