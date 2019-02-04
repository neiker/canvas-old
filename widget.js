import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  selected: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  dragging: {
    borderColor: 'red',
    borderWidth: 2,
  },
});

export default function Widget({ widget, dragging }) {
  return (
    <View
      style={[
        {
          width: widget.width,
          height: widget.height,
          backgroundColor: widget.backgroundColor,
        },
        widget.selected ? styles.selected : undefined,
        dragging && !widget.selected ? styles.dragging : undefined,
      ]}
    />
  );
}
