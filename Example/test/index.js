import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Button } from 'react-native';
import { splineInterpolate } from '../../src/reanimatedSplineInterpolation'

import Animated, { Easing } from 'react-native-reanimated';

const {
  set,
  cond,
  eq,
  add,
  call,
  multiply,
  lessThan,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  debug,
  spring,
  Value,
  Clock,
  event,
} = Animated;

const { width, height } = Dimensions.get('window');
const BOX_SIZE = 20;
const ax = Math.min(width, height / 2 - 50) - BOX_SIZE;
const scale = (ax - BOX_SIZE) / 100;

function runTiming() {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const clock = new Clock();
  const config = {
    duration: 5000,
    toValue: new Value(100),
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), 0, [
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position,
  ]);
}

export default class Example extends Component {
  _transX = runTiming();
  state={
    running: false
  };
  render() {
    const x = multiply(this._transX, scale);
    const y1 = x;
    const interpolated = splineInterpolate(this._transX, [0, 20, 70, 100], [1, 40, 50, 100]);
    const y2 = multiply(interpolated, scale);
    return (
      <View style={styles.container}>
        <View style={styles.chart}>
         <Animated.View
           style={[styles.box, { transform: [{ translateX: this.state.running ? x : 0 }, {translateY: this.state.running ? y1 : 0}] }]}
         />
        </View>
        <View style={styles.chart}>
          <Animated.View
           style={[styles.box, { transform: [{ translateX: this.state.running ? x : 0 }, {translateY: this.state.running ? y2 : 0}] }]}
          />
        </View>
        <Button title='Press me!' onPress={() =>  {
            this._transX = runTiming();
            this.setState({running: !this.state.running })
        }}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  chart:{
    width: ax,
    height: ax
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: BOX_SIZE/2,
    borderColor: '#F5FCFF',
    backgroundColor: 'plum'
  },
});
