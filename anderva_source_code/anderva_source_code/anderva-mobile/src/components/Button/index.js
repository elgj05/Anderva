import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

export default ({children, onPress = () => {}}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#02C1CC',
    width: '100%',
    borderRadius: 15,
    minHeight: 50,
    justifyContent: 'space-evenly',
  },
  text: {
    color: '#fff',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 17,
    textAlign: 'center',
  },
});
