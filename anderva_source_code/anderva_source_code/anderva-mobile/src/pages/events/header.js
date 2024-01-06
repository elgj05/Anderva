import React from 'react';
import {Text, StyleSheet, View, Image, Pressable} from 'react-native';

import icons from '@icons';

export default ({navigation, title}) => {
  return (
    <View style={style.headerContainer}>
      <View>{null}</View>
      <View>
        <Text style={style.headerLabel}>{'Evente'}</Text>
      </View>
      <View>{null}</View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 21,
    marginRight: 21,
    marginTop: 6 + 12,
  },
  icon: {
    width: 23,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
  },
  headerLabel: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 24,
    color: '#02C1CC',
  },
});
