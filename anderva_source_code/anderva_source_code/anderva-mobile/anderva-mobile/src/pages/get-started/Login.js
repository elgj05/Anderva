import React, {useState} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';

import Button from '@components/Button';
import Input from '@components/Input';
import {login as doLogin} from '@helpers';

export default ({navigation}) => {
  return (
    <View style={style.container}>
      <Head />
      <Login navigation={navigation} />
      <Forgot navigation={navigation} />
    </View>
  );
};

const Head = () => {
  return (
    <View style={style.headContainer}>
      <Text style={style.headTitle}>{'Hyr në llogari'}</Text>
    </View>
  );
};

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLoginAction = () => {
    doLogin({email: email.toLowerCase(), password}).then(r => {
      if (r.status === 'success') {
        navigation.navigate('HomeWithMenu');
      } else {
        Alert.alert(r.message);
      }
    });
  };

  return (
    <View style={style.loginContainer}>
      <Input
        placeholder={'Email'}
        additionalStyle={{marginBottom: 20}}
        textContentType={'emailAddress'}
        value={email}
        onChangeText={setEmail}
        autoCapitalize={'none'}
      />
      <Input
        placeholder={'Fjalëkalimi'}
        additionalStyle={{marginBottom: 20}}
        textContentType={'password'}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={doLoginAction}
      />
      <Button onPress={doLoginAction}>{'Hyr në llogari'}</Button>
      <View style={style.tosContainer}>
        <Pressable hitSlop={8} onPress={() => navigation.navigate('About')}>
          <Text style={style.tosLabel}>Rreth Anderva</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Forgot = ({navigation}) => {
  return (
    <View style={style.forgotContainer}>
      <Text
        style={style.forgotTitle}
        onPress={() => navigation.navigate('Register')}>
        {'Nuk ke llogari? Regjistrohu'}
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 40,
  },

  headContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  headTitle: {
    color: '#000',
    fontSize: 26,
    fontFamily: 'WorkSans-Semibold',
    textAlign: 'left',
  },

  loginContainer: {
    flex: 2,
    justifyContent: 'center',
  },

  forgotContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotTitle: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  tosContainer: {marginTop: 14, alignItems: 'center'},
  tosLabel: {
    fontSize: 13,
    fontFamily: 'WorkSans-Medium',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
