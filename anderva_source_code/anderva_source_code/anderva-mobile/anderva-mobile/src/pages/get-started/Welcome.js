import React from 'react';

import {StyleSheet, Text, View, Image} from 'react-native';

import Button from '@components/Button';

export default ({navigation}) => {
  return (
    <View style={styles.container}>
      <Head />
      <Logo />
      <Button onPress={() => navigation.navigate('Login')}>
        Fillo udhëtimin
      </Button>
    </View>
  );
};

const Head = () => {
  return (
    <View
      style={{
        marginBottom: 20,
      }}>
      <Text style={styles.headTitle}>Përshëndetje</Text>

      <Text style={styles.headDescription}>
        Faleminderit që shkarkuat aplikacionin Anderva! Shpresojmë që ta gjeni
        këtë udhetim të këndshëm...
      </Text>
    </View>
  );
};

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={styles.logo}
        source={require('../../assets/logo_full.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  headTitle: {
    color: '#000',
    fontSize: 24,
    fontFamily: 'WorkSans-Semibold',
    textAlign: 'center',
  },
  headDescription: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
  },
});
