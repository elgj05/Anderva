import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Header from './header';
import List from './list';

export default ({navigation, route}) => {
  // testing...
  // useEffect(() => {
  //   setTimeout(
  //     () =>
  //       navRef().dispatch(
  //         CommonActions.navigate('Business', {id: '6087f96971e9f300627f058a'}),
  //       ),
  //     1000,
  //   );
  // }, []);

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
