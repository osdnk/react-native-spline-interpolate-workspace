import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Button } from 'react-native';
import { splineInterpolate } from './../../src/reanimatedSplineInterpolation'

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

const width = Dimensions.get('window').width;

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
    toValue: new Value(width - 2 * BOX_SIZE),
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
    const scale = (width - 2 * BOX_SIZE) / 100;
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.box, { transform: [{ translateX: this.state.running ? this._transX : 0 }] }]}
        />

        <Button title='Press me!' onPress={() => this.setState({running: true})}/>
      </View>
    );
  }
}

const BOX_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderColor: '#F5FCFF',
    backgroundColor: 'plum',
    margin: BOX_SIZE / 2,
  },
});
