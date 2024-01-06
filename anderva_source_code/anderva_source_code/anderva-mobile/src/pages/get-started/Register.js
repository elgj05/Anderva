import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';

import Button from '@components/Button';
import Input from '@components/Input';
import {register as doRegister} from '@helpers';

export default ({navigation}) => {
  return (
    <View style={styles.container}>
      <Head />
      <Register navigation={navigation} />
      <Bottom navigation={navigation} />
    </View>
  );
};

const Head = () => {
  return (
    <View style={styles.headContainer}>
      <Text style={styles.headTitle}>Krijo llogari të re</Text>
    </View>
  );
};

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doRegisterAction = () => {
    if (!name || !email || !password) {
      Alert.alert('Fushat nuk janë të sakta');
      return;
    }
    doRegister({name, email: email.toLowerCase(), password}).then(r => {
      if (r.status === 'success') {
        navigation.navigate('HomeWithMenu');
      } else {
        Alert.alert(r.message);
      }
    });
  };

  return (
    <View style={styles.loginContainer}>
      <Input
        placeholder={'Emri'}
        additionalStyle={{marginBottom: 20}}
        value={name}
        onChangeText={setName}
      />
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
        textContentType={'password'}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={doRegisterAction}
      />
      <Pressable hitSlop={4} onPress={() => navigation.navigate('About')}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'WorkSans-Medium',
            marginVertical: 14,
            paddingHorizontal: 7,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          <Text>Duke krijuar llogari të re ju pranoni&nbsp;</Text>
          <Text
            style={{
              textDecorationLine: 'underline',
            }}>
            Termat & Kushtet
          </Text>
        </Text>
      </Pressable>
      <Button onPress={doRegisterAction}>Krijo Llogari</Button>
    </View>
  );
};

const Bottom = ({navigation}) => {
  return (
    <View style={styles.bottomContainer}>
      <Text
        style={styles.bottomTitle}
        onPress={() => navigation.navigate('Login')}>
        {'Ke llogari? Hyr këtu'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTitle: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
