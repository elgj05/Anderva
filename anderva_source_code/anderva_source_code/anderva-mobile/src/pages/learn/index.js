import React from 'react';
import {StyleSheet, View} from 'react-native';

import Header from './header';
import List from './list';

export default ({navigation, route}) => {
  return (
    <View style={style.container}>
      <Header navigation={navigation} />
      <View style={style.homeContainer}>
        <List navigation={navigation} route={route} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeContainer: {
    marginTop: 21,
    marginLeft: 21,
    marginRight: 21,
  },
});
