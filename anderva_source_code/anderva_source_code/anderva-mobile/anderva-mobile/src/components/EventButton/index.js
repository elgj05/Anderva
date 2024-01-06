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
    backgroundColor: '#E4E6EB',
    width: '100%',
    borderRadius: 8,
    minHeight: 40,
    justifyContent: 'space-evenly',
  },
  text: {
    color: '#333',
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
});
