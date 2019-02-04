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
  tapRef = React.createRef();

  state = {
    dragging: false,
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
      this.setState({ dragging: true });
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

      this.setState({ dragging: false });
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
    }
  }

  render() {
    const { widget } = this.props;
    const { dragging } = this.state;

    return (
      <TapGestureHandler
        onHandlerStateChange={this._onTapHandlerStateChange} // This will made the widget `selected`
        ref={this.tapRef}
        maxDurationMs={500}
        numberOfTaps={1}
        maxDist={5} // User move they finger so ScrollView must receive the event
      >
        <Animated.View>
          <PanGestureHandler
            onGestureEvent={this._onPanGestureEvent}
            onHandlerStateChange={this._onHandlerStateChange}
            minPointers={1}
            maxPointers={1}
            waitFor={widget.selected ? undefined : this.tapRef} // Wait only if the widget is not selected
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
              <Widget widget={widget} dragging={dragging} />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    );
  }
}
