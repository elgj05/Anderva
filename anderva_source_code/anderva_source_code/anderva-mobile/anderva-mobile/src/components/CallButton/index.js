import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';

import icons from '@icons';

export default ({label, onPress = () => {}}) => {
  return (
    <Pressable style={style.container} onPress={onPress} hitSlop={6}>
      <Image source={icons.call} style={style.icon} />
      <Text style={style.text}>{label}</Text>
    </Pressable>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 150,
    height: 37,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#02C1CC',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#02C1CC',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 17,
    marginLeft: -6,
  },
  icon: {
    width: 20,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
    marginHorizontal: 14,
  },
});
