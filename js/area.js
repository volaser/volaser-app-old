import React from "react";
import Svg, {
  Polygon,
  Path,
  Defs,
  Pattern,
  Rect,
  Polyline,
  Line
} from "react-native-svg";

export default class Area extends React.Component {
  getAreaOutline() {
    if (this.props.points.length > 2) {
      return this.props.points.reduce((outline, point) => {
        let x = point.range * Math.cos((point.angle * Math.PI) / 180);
        let y = point.range * Math.sin((point.angle * Math.PI) / 180);
        return outline + ` ${x},${y}`;
      }, "");
    }
    return "0,0";
  }
  render() {
    const Nlines = 20;
    const xgrid = [...Array(Nlines).keys()].map((value, index) => (
      <Line
        key={"x" + index}
        x1={value - Nlines / 2}
        y1="-10"
        x2={value - Nlines / 2}
        y2="10"
        stroke="gray"
        strokeWidth="0.01"
      />
    ));
    const ygrid = [...Array(Nlines).keys()].map((value, index) => (
      <Line
        key={"y" + index}
        y1={value - Nlines / 2}
        x1="-10"
        y2={value - Nlines / 2}
        x2="10"
        stroke="gray"
        strokeWidth="0.01"
      />
    ));
    return (
      <Svg
        height={this.props.height}
        width={this.props.width}
        viewBox={this.props.viewBox}
        preserveAspectRatio="xMinYMin meet"
      >
        {xgrid}
        {ygrid}
        <Polygon
          points={this.getAreaOutline()}
          fill="#175a91"
          fillOpacity="0.5"
          stroke="black"
          strokeWidth="0"
        />
      </Svg>
    );
  }
}
