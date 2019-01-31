import React from 'react';

import {
  View,
} from 'react-native';


export default function Widget({ widget }) {
  return (
    <View
      style={{
        width: widget.width,
        height: widget.height,
        backgroundColor: widget.backgroundColor,
      }}
    />
  );
}
