import React from "react";
import { ScrollView, View } from "react-native";
import { List, ListItem, Button, Icon } from "react-native-elements";
import { observer } from "mobx-react";
import dateFormat from "dateformat";

import styles from "./styles";
import store from "./data_store";
import { calculateArea } from "./calculate";

@observer
export default class DataTable extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Data",
      headerRight: (
        <View style={{ flexDirection: "row" }}>
          <Button
            rounded
            icon={{ name: "file-excel-o", type: "font-awesome" }}
            title="CSV"
            backgroundColor="#08580c"
            onPress={() => store.exportCSV()}
          />
          <Button
            rounded
            icon={{ name: "cloud-upload" }}
            title="Export"
            backgroundColor="#337799"
            onPress={() => store.export()}
          />
        </View>
      )
    };
  };

  render() {
    data = store.list;
    const list_obj = (
      <List>
        {data.map((elem, key) => (
          <ListItem
            key={key}
            title={elem.item.name}
            subtitle={`${dateFormat(
              elem.item.time,
              "mmm d, HH:MM"
            )},  ${calculateArea(elem.item.areaOutline).toFixed(2)} m²`}
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
