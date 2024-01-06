import React from 'react';
import {StyleSheet, View, Pressable, Dimensions, Text} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default ({code, description, visible, setVisible}) => {
  const windowWidth = Dimensions.get('window').width;

  return visible ? (
    <Pressable style={style.container} onPress={() => setVisible(false)}>
      <View style={[style.modalContainer, {width: windowWidth * 0.7}]}>
        <Text style={style.description}>{description}</Text>
        <QRCode value={code} size={windowWidth * 0.6} />
        <Text style={style.code}>{code}</Text>
      </View>
    </Pressable>
  ) : null;
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  description: {
    marginBottom: 10,
    color: '#02C1CC',
    fontSize: 14,
    fontFamily: 'WorkSans-Semibold',
    letterSpacing: -0.31,
    textAlign: 'center',
  },
  code: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
    fontFamily: 'WorkSans-Semibold',
    letterSpacing: -0.26,
    textAlign: 'center',
  },
});
