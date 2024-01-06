import AnimatedSplash from 'react-native-animated-splash-screen';

import React, {useEffect, useState} from 'react';
import {
  useColorScheme,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import GetStarted from './get-started';
import HomeWithMenu from './menu';
import {checkCurrentUser, isLoggedIn} from '@helpers';

// navigation ref, reused on other funcs
export const navigationRef = React.createRef();
export function navRef() {
  return navigationRef.current;
}

const Stack = createStackNavigator();

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    // checkCurrentUser();
    isLoggedIn().then(yes =>
      setInitialRoute(yes ? 'HomeWithMenu' : 'GetStarted'),
    );
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        {initialRoute ? (
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              name="GetStarted"
              component={GetStarted}
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="HomeWithMenu"
              component={HomeWithMenu}
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </Stack.Navigator>
        ) : null}
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 2000);
  }, []);

  return (
    <AnimatedSplash
      isLoaded={isLoaded}
      logoImage={require('../assets/logo_full.png')}
      backgroundColor={'#fff'}
      logoHeight={600}
      logoWidth={278}>
      <App />
    </AnimatedSplash>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
