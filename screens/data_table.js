import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";

export default class DataTable extends React.Component {
  render() {
    data = this.props.screenProps.data;
    if (data == null) {
      data = [];
    }
    const list_obj = (
      <List>
        {data.map((item, key) => (
          <ListItem
            key={key}
            title={item.name}
            subtitle={Date(item.time)}
            onPress={() =>
              this.props.navigation.navigate("DataCard", { ...item, key: key })
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
