import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, List, ListItem } from "react-native-elements";

const list = require("../data.json");

export default class DataTable extends React.Component {
  render() {
    const list_obj = (
      <List>
        {list.map(item => (
          <ListItem
            key={item.name}
            title={item.name}
            subtitle={item.time}
            onPress={() => this.props.navigation.navigate("DataCard")}
          />
        ))}
      </List>
    );
    return <View style={styles.container}>{list_obj}</View>;
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
