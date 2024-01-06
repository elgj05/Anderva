import React from 'react';
import {StyleSheet, Image, TouchableOpacity, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './home';
import Learn from './learn';
import Events from './events';

import Icons from '@icons';

const Tab = createBottomTabNavigator();

const MyTabBar = ({state, descriptors, navigation}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={style.tab}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let icon = null;
        if (route.name === 'Kreu') {
          icon = Icons.home;
        } else if (route.name === 'Mëso') {
          icon = Icons.learn;
        } else if (route.name === 'Evente') {
          icon = Icons.events;
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            activeOpacity={1}
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            // testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={style.tabBarButton}>
            <Image
              source={icon}
              style={[
                style.icon,
                {
                  tintColor: isFocused ? '#02C1CC' : '#000',
                },
              ]}
            />
            <Text
              style={[
                {
                  color: isFocused ? '#02C1CC' : '#000',
                },
                style.label,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName="Kreu"
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Kreu" component={Home} />
      <Tab.Screen name="Mëso" component={Learn} />
      <Tab.Screen name="Evente" component={Events} />
    </Tab.Navigator>
  );
};

const style = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 11,
    borderTopColor: 'rgba(151, 151, 151, .23)',
    borderTopWidth: 1,
  },
  icon: {
    width: 28,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
  },
  label: {
    paddingTop: 7,
    paddingBottom: 7,
    fontSize: 15,
    fontFamily: 'WorkSans-Regular',
  },
  tabBarButton: {flex: 1, alignItems: 'center'},
});
