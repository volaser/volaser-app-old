import { action, observable } from "mobx";
import asyncStore from "react-native-simple-store";

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
        console.log({ list: this.list, index: index });
      }
    } catch (err) {
      console.log("Could not refresh:" + err);
    }
  };
}

const store = new Store();
export default store;
