import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Button, Animated } from "react-native";
import { splineInterpolate } from "../../src/animatedSplineInterpolation";

const { multiply, Value, timing } = Animated;

import { __makeChart } from "../../src/splineInterpolation";

const { width, height } = Dimensions.get("window");
const DOT_SIZE = 20;
const CHART_DOT_SIZE = 4;
const ax = Math.min(width, height / 2 - 50) - DOT_SIZE;
const scale = (ax - DOT_SIZE) / 100;

const INPUT = [0, 20, 45, 70, 85, 100];
const OUTPUT = [100, 70, 60, 30, 35, 0];
export default class Example extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {
      startAnimation: () => {}
    };
    return {
      headerRight: <Button onPress={params.startAnimation} title="Start" />
    };
  };

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      startAnimation: () => {
        this._anim.start();
      }
    });
  }

  _transX = new Value(0);
  _anim = timing(this._transX, {
    toValue: 100,
    duration: 5000
  });

  __charts = __makeChart(INPUT, OUTPUT, scale);

  render() {
    const x = multiply(this._transX, scale);
    const y1 = x;
    const interpolated = splineInterpolate(this._transX, INPUT, OUTPUT);
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
                transform: [{ translateX: x }, { translateY: y1 }]
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
                transform: [{ translateX: x }, { translateY: y2 }]
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
