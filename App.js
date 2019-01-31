/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import {
  ScrollView,
} from 'react-native-gesture-handler';

import WidgetDraggable from './draggable-widget';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444',
  },
  contentContainerStyle: {
    backgroundColor: '#fafafa',
    width: 2000,
    height: 1000,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  item: {
    flex: 1,
    position: 'absolute',
  },
});


const CONTENT_INSET = {
  top: 100,
  left: 100,
  bottom: 100,
  right: 100,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

type Props = {};
export default class App extends React.Component<Props> {
  state = {
    widgets: [
      {
        id: 1,
        x: getRandomInt(0, 1000),
        y: getRandomInt(0, 500),
        width: 100,
        height: 100,
        backgroundColor: 'red',
      },
      {
        id: 2,
        x: getRandomInt(0, 1000),
        y: getRandomInt(0, 500),
        width: 100,
        height: 100,
        backgroundColor: 'green',
      },
      {
        id: 3,
        x: getRandomInt(0, 1000),
        y: getRandomInt(0, 500),
        width: 100,
        height: 100,
        backgroundColor: 'blue',
      },
    ],
  }

  onMove = (newPosition) => {
    console.log('onMove', newPosition);
  }

  render() {
    const {
      widgets,
    } = this.state;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        minimumZoomScale={0.1}
        maximumZoomScale={2}
        contentInset={CONTENT_INSET}
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {widgets.map(widget => (
          <WidgetDraggable key={widget.id} widget={widget} onMove={this.onMove} />
        ))}
      </ScrollView>
    );
  }
}
