import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Not implemented yet!
        </Text>
      </View>
    );
  }
}

const BOX_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderColor: '#F5FCFF',
    alignSelf: 'center',
    backgroundColor: 'plum',
    margin: BOX_SIZE / 2,
  },
});
