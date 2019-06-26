import { magenetometer, gyroscope } from "react-native-sensors";

const magSub = magenetometer.subscribe(({ x, y, z, timestamp }) =>
  console.log({ x, y, z, timestamp })
);

const gyroSub = gyroscope.subscribe(({ x, y, z, timestamp }) =>
  console.log({ x, y, z, timestamp })
);

export { magSub };
