import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { observer } from "mobx-react";

import store from "./data_store";

@observer
export default class DataTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("store: " + store.list);
    data = store.list;
    const list_obj = (
      <List>
        {data.map((elem, key) => (
          <ListItem
            key={key}
            title={elem.item.name}
            subtitle={Date(elem.item.time)}
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
