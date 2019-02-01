import React from 'react';

import {
  Animated,
  StyleSheet,
} from 'react-native';

import {
  throttle,
} from 'lodash';

import {
  State,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';

import Widget from './widget';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    position: 'absolute',
  },
});


const ON_DELTA_MOVE_THROTTLE = 100;

export default class WidgetDraggable extends React.Component {
  panRef = React.createRef();

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
        listener: ({ nativeEvent }) => {
          this.onDeltaMove({
            translationX: nativeEvent.translationX,
            translationY: nativeEvent.translationY,
          });
        },
      },
    );
  }

  onDeltaMove = throttle((event) => {
    this.onMove({
      x: this._lastOffset.x + event.translationX,
      y: this._lastOffset.y + event.translationY,
    });
  }, ON_DELTA_MOVE_THROTTLE)


  onMove = (event) => {
    const {
      onMove,
      widget,
    } = this.props;

    if (this.dragging) {
      onMove({
        id: widget.id,
        ...event,
      });
    }
  };

  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      this.dragging = true;
    } else if (nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += nativeEvent.translationX;
      this._lastOffset.y += nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);

      this.onMove({
        ...this._lastOffset,
      });

      this.dragging = false;
    }
  }

  _onTapHandlerStateChange = ({ nativeEvent }) => {
    const {
      onTap,
      widget,
    } = this.props;

    if (nativeEvent.state === State.ACTIVE) {
      onTap({
        id: widget.id,
      });
    }
  }

  render() {
    const { widget } = this.props;

    return (
      <TapGestureHandler
        onHandlerStateChange={this._onTapHandlerStateChange}
        waitFor={this.panRef}
      >
        <Animated.View>
          <PanGestureHandler
            onGestureEvent={this._onGestureEvent}
            onHandlerStateChange={this._onHandlerStateChange}
            maxPointers={1}
            ref={this.panRef}
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
        </Animated.View>
      </TapGestureHandler>
    );
  }
}
