import React, { Component } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { splineInterpolate } from "../src/reanimatedSplineInterpolation";
import Animated, { Easing } from "react-native-reanimated";

import { __makeChart } from "../src/splineInterpolation";

const {
  cond,
  multiply,
  startClock,
  interpolate: linearInterpolate,
  stopClock,
  clockRunning,
  block,
  timing,
  add,
  debug,
  Value,
  divide,
  sub,
  Clock
} = Animated;





const lagrangeInterpolate = (val, { inputRange, outputRange }) => {
  const nodes = [];
  for (let i = 0; i < inputRange.length; i++) {
    const factors = [];
    for (let j = 0; j < inputRange.length; j++) {
      if (i === j) {
        continue;
      }
      factors.push(divide(sub(val, inputRange[j]), sub(inputRange[i],inputRange[j])))
    }
    nodes.push(multiply(...factors, outputRange[i]))
  }
  return add(...nodes);
}



const strategy = splineInterpolate;

// Basic example
/*
const POINTS = [
  [0, 10],
  [100, 60],
  [200, 110],
]
*/

/*const POINTS = [
  [0, 10],
  [40, 60],
  [100, 40],
  [200, 110],
]*/

const POINTS = [
  [0, 10],
  [20, 10],
  [40, 60],
  [50, 40],
  [70, 40],
  [100, 110],
  [130, 10],
  [200, 80],
]

/*const POINTS = [
  [0, 10],
  [40, 60],
  [50, 50],
  [200, 110],
]*/



const { width, height } = Dimensions.get("window");
const DOT_SIZE = 20;
const CHART_DOT_SIZE = 20;
const ax = Math.min(width, height / 2 - 50) - DOT_SIZE;
const scale = (ax - DOT_SIZE) / 100;

function runTiming() {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };
  const clock = new Clock();
  const config = {
    duration: 5000,
    toValue: new Value(inputRange[inputRange.length-1]),
    easing: Easing.linear
  };

  return block([
    cond(clockRunning(clock),
      timing(clock, state, config)
      , [
      startClock(clock)]
    ),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}

const [inputRange, outputRange] = (() => {
  const inputRange = [];
  const outputRange = [];
  for (let i in POINTS) {
    const p = POINTS[i]
    inputRange.push(p[0])
    outputRange.push(p[1])
  }
  return [inputRange, outputRange]
})()

export default class Example extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {
      startAnimation: () => {}
    };
    return {
      headerRight: <Button onPress={params.startAnimation} title="Start" />
    };
  };
  _transX = runTiming();
  state = {
    running: false
  };

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      startAnimation: () => {
        this._transX = runTiming();
        this.setState({ running: !this.state.running });
      }
    });
  }

  render() {
    const points = (() => {
      const res = [];
      for (let i = 0; i< inputRange.length; i++) {
        res.push({
          y: inputRange[i],
          x: outputRange[i]
        })
      }
      return res;
    })();
    const y = multiply(this._transX, scale);
    const interpolated = strategy(this._transX, { inputRange, outputRange });
    const y2 = multiply(interpolated, scale);
    return (
      <View style={styles.container}>
        {points.map(c => (
          <View
            key={`__${c.y}`}
            style={[
              styles.chartdot,
              {
                top: scale * c.y,
                left: scale * c.x,
                backgroundColor: "red"
              }
            ]}
          />
        ))}
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  { translateX: this.state.running ? y2 : scale * POINTS[0][1] },
                  { translateY: this.state.running ? y : scale * POINTS[0][0] }
                ]
              }
            ]}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chart: {
    width: ax + 10,
    height: ax + 10,
    padding: 5,
    borderWidth: 2,
    borderColor: "#06060688",
    margin: 2
  },
  chartdot: {
    position: "absolute",
    borderRadius: CHART_DOT_SIZE / 2,
    width: CHART_DOT_SIZE,
    height: CHART_DOT_SIZE,
    backgroundColor: "#06060633"
  },
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  box: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderColor: "#F5FCFF",
    backgroundColor: "#005fff88"
  }
});
