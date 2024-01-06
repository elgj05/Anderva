import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, Image, Pressable} from 'react-native';
import icons from '@icons';
import {DrawerActions, CommonActions} from '@react-navigation/native';

import Input from '@components/Input';
import {useDebounce} from '@helpers';

export default ({navigation}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return searchOpen ? (
    <SearchHeader navigation={navigation} setSearchOpen={setSearchOpen} />
  ) : (
    <MainHeader navigation={navigation} setSearchOpen={setSearchOpen} />
  );
};

const MainHeader = ({navigation, setSearchOpen}) => (
  <View style={style.container}>
    <Pressable
      hitSlop={10}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <Image source={icons.menu} style={style.icon} />
    </Pressable>
    <Pressable
      style={style.logoContainer}
      onPress={() => {
        navigation.setParams({
          refreshNow: Math.floor(new Date().getTime() / 1000),
        });
      }}>
      <Image
        source={require('../../assets/logo_full.png')}
        style={style.logo}
      />
    </Pressable>
    <Pressable onPress={() => setSearchOpen(true)}>
      <Image source={icons.search} style={style.icon} />
    </Pressable>
  </View>
);

const SearchHeader = ({navigation, setSearchOpen}) => {
  const [debouncedSearch, setSearch, search] = useDebounce('', 500);

  useEffect(() => {
    navigation.setParams({search});
  }, [debouncedSearch]);

  return (
    <View style={style.container}>
      <Pressable
        hitSlop={10}
        onPress={() => {
          setSearchOpen(false);
          navigation.setParams({search: null});
          // reset filter etc!?
        }}>
        <Image source={icons.back} style={style.icon} />
      </Pressable>
      <View style={style.searchInputContainer}>
        <Input
          placeholder={'Kërko biznes, qytet, etj.'}
          additionalStyle={{fontSize: 15}}
          value={search}
          onChangeText={setSearch}
          autoFocus={true}
        />
      </View>
      <View>{null}</View>
      {/* <Pressable
        onPress={() => {
          navigation.setParams({search});
        }}>
        <Image source={icons.search} style={style.icon} />
      </Pressable> */}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 21,
    marginRight: 21,
    marginTop: 21,
  },
  logoContainer: {
    marginTop: -11,
  },
  searchInputContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  icon: {
    width: 28,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
  },
  logo: {
    width: 132,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 2.15,
  },
});
