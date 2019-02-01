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
  View,
} from 'react-native';

import randomColor from 'randomcolor';

import {
  ScrollView,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

import WidgetDraggable from './draggable-widget';

const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 2000;
const WIDGET_SIZE = 132;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444',
  },
  contentContainerStyle: {
    backgroundColor: '#fafafa',
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
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

function getRandomWidgets(size = 5) {
  // eslint-disable-next-line
  return Array.apply(null, Array(size)).map(function (_, index) {
    return {
      id: index,
      x: getRandomInt(0, CANVAS_WIDTH - WIDGET_SIZE),
      y: getRandomInt(0, CANVAS_HEIGHT - WIDGET_SIZE),
      width: WIDGET_SIZE,
      height: WIDGET_SIZE,
      backgroundColor: randomColor(),
      tapRef: React.createRef(),
    };
  });
}

type Props = {};
export default class App extends React.Component<Props> {
  state = {
    widgets: getRandomWidgets(100),
  }

  _onTapHandlerStateChange = ({ nativeEvent }) => {
    console.log('====================================');
    console.log('_onTapHandlerStateChange canvas', nativeEvent.state, State);
    console.log('====================================');
    if (nativeEvent.state === State.ACTIVE) {
      this.onTapCanvas();
    }
  }

  onMoveWidget = ({ id, x, y }) => {
    console.log('onMoveWidget', { id, x, y });

    this.setState(state => ({
      widgets: state.widgets.map((widget) => {
        if (widget.id !== id) {
          return widget;
        }

        return {
          ...widget,
          x,
          y,
        };
      }),
    }));
  }

  onTapWidget = ({ id }) => {
    console.log('onTapWidget', id);

    this.setState(state => ({
      widgets: state.widgets.map((widget) => {
        if (widget.id !== id) {
          if (widget.selected) {
            return {
              ...widget,
              selected: false,
            };
          }

          return widget;
        }

        return {
          ...widget,
          selected: !widget.selected,
        };
      }),
    }));
  }


  onTapCanvas = () => {
    console.log('onTapCanvas');

    this.setState(state => ({
      widgets: state.widgets.map((widget) => {
        if (widget.selected) {
          return {
            ...widget,
            selected: false,
          };
        }

        return widget;
      }),
    }));
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
        <TapGestureHandler
          onHandlerStateChange={this._onTapHandlerStateChange}
          waitFor={widgets.map(widget => widget.tapRef)}
        >
          <View>
            {widgets.map(widget => (
              <WidgetDraggable
                key={widget.id}
                widget={widget}
                onMove={this.onMoveWidget}
                onTap={this.onTapWidget}
              />
            ))}
          </View>
        </TapGestureHandler>
      </ScrollView>
    );
  }
}
