import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Welcome from './Welcome';
import Login from './Login';
import Register from './Register';
import About from '@pages/about';

const GetStartedStack = createStackNavigator();

export default ({navigation}) => {
  return (
    <GetStartedStack.Navigator initialRouteName="Welcome">
      <GetStartedStack.Screen
        name="Welcome"
        component={Welcome}
        options={{headerShown: false}}
      />
      <GetStartedStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <GetStartedStack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <GetStartedStack.Screen
        name="About"
        component={About}
        options={{headerShown: false}}
      />
    </GetStartedStack.Navigator>
  );
};
