import React from 'react';

import {
  Animated,
  StyleSheet,
} from 'react-native';

import {
  State,
  PanGestureHandler,
} from 'react-native-gesture-handler';

import Widget from './widget';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    position: 'absolute',
  },
});


export default class WidgetDraggable extends React.Component {
  constructor(props) {
    super(props);
    const { widget } = this.props;

    this._lastOffset = { x: widget.x, y: widget.y };

    this._translateX = new Animated.Value(0);
    this._translateX.setOffset(this._lastOffset.x);

    this._translateY = new Animated.Value(0);
    this._translateY.setOffset(this._lastOffset.y);


    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX,
            translationY: this._translateY,
          },
        },
      ],
      {
        useNativeDriver: true,
        listener: (event) => {
          const {
            translationX,
            translationY,
          } = event.nativeEvent;

          console.log('====================================');
          console.log({
            translationX: this._lastOffset.x + translationX,
            translationY: this._lastOffset.y + translationY,
          });
          console.log('====================================');
        },
      },
    );
  }

  _onHandlerStateChange = (event) => {
    const {
      onMove,
      widget,
    } = this.props;

    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);

      onMove({
        id: widget.id,
        ...this._lastOffset,
      });
    }
  };

  render() {
    const { widget } = this.props;

    return (
      <PanGestureHandler
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this._onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.item,
            {
              transform: [
                { translateX: this._translateX },
                { translateY: this._translateY },
              ],
            },
          ]}
        >
          <Widget widget={widget} />
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
