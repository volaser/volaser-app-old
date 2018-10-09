import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { observer } from "mobx-react";
import dateFormat from "dateformat";

import store from "./data_store";

@observer
export default class DataTable extends React.Component {
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
            subtitle={
              dateFormat(elem.item.time, "mmm d, HH:MM") +
              "  " +
              elem.item.range +
              " (m)"
            }
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
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff"
  }
});
