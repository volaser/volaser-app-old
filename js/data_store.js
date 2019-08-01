import { Share } from "react-native";
import { parse } from "json2csv";
import { action, observable } from "mobx";
import asyncStore from "react-native-simple-store";
import logger from "./logging";

import haversine from "haversine-distance";

let index = 0;

class Store {
  @observable
  list = [];

  constructor() {
    this.refreshStores();
  }

  push(item) {
    this.list.push({
      item,
      index
    });

    index++;
    asyncStore.update("data", { list: this.list, index: index });
  }

  delete(item) {
    this.list = this.list.filter(l => {
      return l.index !== item.index;
    });
    asyncStore.save("data", { list: this.list, index: index });
  }

  @action
  refreshStores = async () => {
    try {
      const asyncStorage = await asyncStore.get("data");
      if (asyncStorage == null) {
        this.list = [];
        index = 0;
      } else {
        this.list = asyncStorage.list;
        index = asyncStorage.index;
        if (this.list == null) {
          this.list = [];
          index = 0;
        }
        console.log({ list: this.list, index: index });
      }
    } catch (err) {
      logger.log("Could not refresh:" + err);
      this.list = [];
      index = 0;
    }
  };

  collect() {
    return this.list.reduce((accum, elem) => {
      if (
        accum.some(
          accum_elem =>
            haversine(accum_elem.item.location, elem.item.location) < 100
        )
      ) {
      } else {
        accum.push(elem);
      }

      return accum;
    }, []);
  }

  export(index = null) {
    if (index != null) {
      const item = this.list.find(item => item.index == index);
      Share.share({
        message: JSON.stringify(item.item),
        title: `Volaser Data: ${item.item.name}`
      });
    } else {
      Share.share({
        message: JSON.stringify(
          this.list.map(item => {
            return { index: item.index, ...item.item };
          })
        ),
        title: "All Volaser Data"
      });
    }
  }

  exportCSV() {
    Share.share({
      message: parse(
        this.list.map(item => {
          return {
            name: item.item.name,
            time: item.item.time,
            area: parseFloat(item.item.area.toFixed(3)),
            sludge_depth: item.item.sludgeDepth,
            bottom_depth: item.item.bottomDepth,
            longitude: parseFloat(item.item.location.longitude.toFixed(3)),
            latitude: parseFloat(item.item.location.latitude.toFixed(3))
          };
        }),
        {
          fields: [
            "name",
            "time",
            "longitude",
            "latitude",
            "area",
            "sludge_depth",
            "bottom_depth"
          ]
        }
      ),
      title: "Volaser CSV Data"
    });
  }
}

const store = new Store();
export default store;
