import React from 'react';
import {Text, StyleSheet, View, Image, Pressable} from 'react-native';

import icons from '@icons';

export default ({navigation}) => {
  return (
    <View style={style.headerContainer}>
      <Pressable hitSlop={20} onPress={() => navigation.goBack()}>
        <Image source={icons.back} style={style.icon} />
      </Pressable>
      <View>
        <Text style={style.headerLabel}>{'Event'}</Text>
      </View>
      <View>{null}</View>
    </View>
  );
};

const style = StyleSheet.create({
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
    fontFamily: 'WorkSans-Medium',
    fontSize: 24,
    color: '#02C1CC',
  },
});
