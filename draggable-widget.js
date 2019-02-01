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
  LongPressGestureHandler,
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

  longpressRef = React.createRef();

  state = {
    holding: false,
  }

  constructor(props) {
    super(props);
    const { widget } = this.props;

    this._lastOffset = { x: widget.x, y: widget.y };

    this._translateX = new Animated.Value(0);
    this._translateX.setOffset(this._lastOffset.x);

    this._translateY = new Animated.Value(0);
    this._translateY.setOffset(this._lastOffset.y);


    this._onPanGestureEvent = Animated.event(
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

  _onLongPressHandlerStateChange = ({ nativeEvent }) => {
    const {
      onLongPress,
      widget,
    } = this.props;

    console.log('====================================');
    console.log(nativeEvent);
    console.log('====================================');

    if (nativeEvent.state === State.ACTIVE) {
      onLongPress({
        id: widget.id,
      });
      this.setState({ holding: true });
    } else if (nativeEvent.oldState === State.ACTIVE) {
      this.setState({ holding: false });
    }
  }

  render() {
    const { widget } = this.props;
    const { holding } = this.state;

    return (
      <LongPressGestureHandler
        onHandlerStateChange={this._onLongPressHandlerStateChange}
        minDurationMs={300}
        simultaneousHandlers={this.panRef}
        ref={this.longpressRef}
      >
        <TapGestureHandler
          onHandlerStateChange={this._onTapHandlerStateChange}
          waitFor={this.panRef}
        >
          <Animated.View>
            <PanGestureHandler
              onGestureEvent={this._onPanGestureEvent}
              onHandlerStateChange={this._onHandlerStateChange}
              minPointers={1}
              maxPointers={1}
              enabled={holding || widget.selected}
              ref={this.panRef}
              simultaneousHandlers={this.longpressRef}
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
      </LongPressGestureHandler>
    );
  }
}
