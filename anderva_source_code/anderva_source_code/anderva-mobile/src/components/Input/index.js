import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

export default props => {
  const {additionalStyle} = props;
  return (
    <TextInput
      style={[styles.textinput, additionalStyle]}
      placeholderTextColor={'#888'}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  textinput: {
    width: '100%',
    minHeight: 50,
    color: '#333',
    fontFamily: 'WorkSans-Medium',
    fontSize: 17,
    borderColor: '#E4E6EB',
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: 15,
  },
});
