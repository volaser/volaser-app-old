import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, List, ListItem } from "react-native-elements";

const list = [
  {
    id: 0,
    name: "Data 1",
    location: "some place",
    time: "June 5"
  },
  {
    id: 1,
    name: "Test Data",
    location: "some place",
    time: "May 5"
  },
  {
    id: 2,
    name: "Pit Latrine III",
    location: "some place",
    time: "July 27"
  },
  {
    id: 3,
    name: "Data 4",
    location: "some place",
    time: "August 7"
  }
];

export default class DataTable extends React.Component {
  static navigationOptions = {
    title: "Data",
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="database"
        type="material-community"
        size={28}
        color={tintColor}
      />
    )
  };
  render() {
    const list_obj = (
      <List>
        {list.map(item => (
          <ListItem key={item.name} title={item.name} subtitle={item.time} />
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
