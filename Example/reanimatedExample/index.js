import React, { Component } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { splineInterpolate } from "../src/reanimatedSplineInterpolation";
import Animated, { Easing } from "react-native-reanimated";

import { __makeChart } from "../src/splineInterpolation";

const {
  cond,
  multiply,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  greaterThan,
  debug,
  Value,
  Clock
} = Animated;

const { width, height } = Dimensions.get("window");
const DOT_SIZE = 20;
const CHART_DOT_SIZE = 4;
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
    toValue: new Value(100),
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

const inputRange = [0, 20, 70, 100];
const outputRange = [0, 40, 50, 100];
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
  __charts = __makeChart(inputRange, outputRange, scale);

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
    const x = multiply(this._transX, scale);
    const y1 = x;
    const interpolated = splineInterpolate(this._transX, { inputRange, outputRange });
    const y2 = multiply(interpolated, scale);
    return (
      <View style={styles.container}>
        <View style={styles.chart}>
          {[...Array(101).keys()].map(c => (
            <View
              key={c * scale}
              style={[
                styles.chartdot,
                {
                  top: c * scale + DOT_SIZE / 2 + CHART_DOT_SIZE / 2 + 1,
                  left: c * scale + DOT_SIZE / 2 + CHART_DOT_SIZE / 2 + 1
                }
              ]}
            />
          ))}
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  { translateX: this.state.running ? x : 0 },
                  { translateY: this.state.running ? y1 : 0 }
                ]
              }
            ]}
          />
        </View>
        <View style={styles.chart}>
          {this.__charts.map(c => (
            <View
              key={`${c.isNode ? "n" : "t"} ${c.x}`}
              style={[
                styles.chartdot,
                {
                  top: c.y + DOT_SIZE / 2 + CHART_DOT_SIZE / 2 + 1,
                  left: c.x + DOT_SIZE / 2 + CHART_DOT_SIZE / 2 + 1,
                  backgroundColor: c.isNode ? "red" : "#06060633"
                }
              ]}
            />
          ))}
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  { translateX: this.state.running ? x : 0 },
                  { translateY: this.state.running ? y2 : 0 }
                ]
              }
            ]}
          />
        </View>
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
    alignItems: "center",
    justifyContent: "center",
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
