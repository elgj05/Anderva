import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';

import icons from '@icons';

export default ({label, onPress = () => {}}) => {
  return (
    <Pressable style={style.container} onPress={onPress} hitSlop={6}>
      <Image source={icons.couponBackground} style={style.icon} />
      <Text style={style.text}>{label}</Text>
    </Pressable>
  );
};

const style = StyleSheet.create({
  container: {
    marginTop: 2,
    width: 190,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18,
    position: 'relative',
  },
  text: {
    color: '#fff',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 17,
    textAlign: 'center',
    marginTop: -4,
  },
  icon: {
    width: undefined,
    resizeMode: 'contain',
    height: 67,
    aspectRatio: 3.37,
    position: 'absolute',
  },
});
