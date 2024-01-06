import React, {useState, useEffect} from 'react';
import {Text, View, Image, StyleSheet, Pressable} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {CommonActions} from '@react-navigation/native';

import HomeWithTabs from './tabs';
import About from './about';
import Business from './home/business';
import Category from './home/category';
import Article from './learn/article';
import Event from './events/event';

import {getCategories, logout} from '@helpers';

const Drawer = createDrawerNavigator();

export default ({navigation}) => {
  const [cats, setCats] = useState([]);
  useEffect(() => {
    getCategories({filter: {fields: ['id', 'name']}}).then(res => {
      if (res && res.data && Array.isArray(res.data)) {
        setCats(res.data);
      }
    });
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="HomeWithTabs"
      drawerContent={props => drawerContent(props, cats)}
      drawerType={'slide'}
      // detachInactiveScreens={false}
      // openByDefault={true} // testing
      // minSwipeDistance={30}
      overlayColor={'rgba(0,0,0,0.1)'}
      edgeWidth={0}>
      <Drawer.Screen name="HomeWithTabs" component={HomeWithTabs} />
      <Drawer.Screen name="Business" component={Business} />
      <Drawer.Screen name="Category" component={Category} />
      <Drawer.Screen name="Article" component={Article} />
      <Drawer.Screen name="Event" component={Event} />
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
};

const drawerContent = (props, cats) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={style.container}>
      <View style={style.topContainer}>
        <Image source={require('../assets/logo_full.png')} style={style.logo} />
        <Pressable
          style={style.item}
          onPress={() => {
            // home reset page
            props.navigation.dispatch(CommonActions.navigate('HomeWithTabs'));
          }}>
          <Text style={style.itemLabelActive}>Kreu</Text>
        </Pressable>
        {cats &&
          cats.map((cat, i) => (
            <Pressable
              key={i + '_cat'}
              style={style.item}
              onPress={() => {
                props.navigation.navigate('Category', {
                  categoryId: cat.id,
                  categoryTitle: cat.name,
                });
              }}>
              <Text style={style.itemLabel}>{cat.name}</Text>
            </Pressable>
          ))}
        {/* <Pressable
          style={style.item}
          onPress={() => {
            props.navigation.dispatch(CommonActions.navigate('Mëso'));
          }}>
          <Text style={style.itemLabel}>Mëso</Text>
        </Pressable>
        <Pressable
          style={style.item}
          onPress={() => {
            props.navigation.dispatch(CommonActions.navigate('Evente'));
          }}>
          <Text style={style.itemLabel}>Evente</Text>
        </Pressable> */}
      </View>
      <View style={style.bottomContainer}>
        <Pressable
          style={style.itemBottom}
          onPress={() => {
            props.navigation.dispatch(CommonActions.navigate('About'));
          }}>
          <Text style={style.itemBottomLabel}>Rreth Anderva</Text>
        </Pressable>
        <Pressable
          style={style.itemBottom}
          onPress={() => {
            logout().then(() => {
              props.navigation.dispatch(CommonActions.navigate('GetStarted'));
            });
          }}>
          <Text style={style.itemBottomLabelGray}>Dil</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 35,
    marginRight: 15,
  },
  topContainer: {
    //
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logo: {
    width: 132,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 2.15,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginRight: 20,
  },
  item: {
    marginVertical: 11,
  },
  itemLabel: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 21,
    letterSpacing: -0.49,
  },
  itemLabelActive: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 21,
    color: '#02C1CC',
    letterSpacing: -0.49,
  },
  itemBottom: {
    marginBottom: 22,
  },
  itemBottomLabel: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    letterSpacing: -0.38,
  },
  itemBottomLabelGray: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    color: '#888888',
    letterSpacing: -0.38,
  },
});
