// Logging class and a React Component for displaying the log.
// Calling logger.log() elsewhere will append to the log shown in the component
// as well as call console.log()

import React from "react";
import { ScrollView, Share } from "react-native";
import { Text } from "react-native-elements";
import { observable } from "mobx";
import { observer } from "mobx-react";
import dateFormat from "dateformat";

class Logger {
  @observable
  logString = "";

  log(message) {
    console.log(message);
    this.logString =
      this.logString +
      "\n" +
      dateFormat(Date(), "HH:MM:ss ") +
      JSON.stringify(message);
  }

  error(message) {
    this.log(`Error: ${message}`);
  }
}

@observer
export class Console extends React.Component {
  export() {
    Share.share({
      message: logger.logString,
      title: `Volaser Debug Console (${dateFormat(Date(), "mm-dd HH:MM")})`
    });
  }

  render() {
    return (
      <ScrollView
        style={{ backgroundColor: "#555" }}
        ref={ref => (this.scrollView = ref)}
        onContentSizeChange={(contentWidth, contentHeight) => {
          this.scrollView.scrollToEnd({ animated: true });
        }}
      >
        <Text
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "#555",
            color: "#fff"
          }}
          onLongPress={() => this.export()}
        >
          {logger.logString}
        </Text>
      </ScrollView>
    );
  }
}

const logger = new Logger();
export default logger;
