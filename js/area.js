import React from "react";
import Svg, { Polygon, Polyline } from "react-native-svg";

export default class Area extends React.Component {
  getAreaOutline() {
    if (this.props.points.length > 2) {
      return this.props.points.reduce((outline, point) => {
        let x = point["range"] * Math.cos((point["angle"] * Math.PI) / 180);
        let y = point["range"] * Math.sin((point["angle"] * Math.PI) / 180);
        return outline + ` ${x},${y}`;
      }, "");
    }
    return "0,0";
  }
  render() {
    const boxRadius = 3.9;
    return (
      <Svg
        height={this.props.height}
        width={this.props.width}
        viewBox={this.props.viewBox}
      >
        <Polygon
          points={this.getAreaOutline()}
          //   points={this.getAreaOutline()}
          fill="#ccc"
          stroke="black"
          strokeWidth="0"
        />
        <Polyline
          points={`${boxRadius},${boxRadius} -${boxRadius},${boxRadius} -${boxRadius},-${boxRadius}, ${boxRadius},-${boxRadius} ${boxRadius},${boxRadius}`}
          fill="none"
          stroke="gray"
          strokeWidth="0.0"
        />
      </Svg>
    );
  }
}
