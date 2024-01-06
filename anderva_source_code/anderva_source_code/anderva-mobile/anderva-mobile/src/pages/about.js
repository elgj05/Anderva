import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import {WebView} from 'react-native-webview';

import icons from '@icons';

export default ({navigation}) => {
  return (
    <View style={style.container}>
      <Header navigation={navigation} />
      <ScrollView
        style={style.pageContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Tos />
      </ScrollView>
    </View>
  );
};

export const Header = ({navigation}) => {
  return (
    <View style={style.headerContainer}>
      <Pressable hitSlop={20} onPress={() => navigation.goBack()}>
        <Image source={icons.back} style={style.icon} />
      </Pressable>
      <View>
        <Text style={style.headerLabel}>Rreth Anderva</Text>
      </View>
      <View>{null}</View>
    </View>
  );
};

const Tos = () => {
  const TosUrl = 'https://anderva.app/tos.html';
  const webViewScript = `
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); 
    }, 100);
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  const [height, setHeight] = useState(500);
  return (
    <WebView
      mixedContentMode={'compatibility'}
      automaticallyAdjustContentInsets={false}
      scrollEnabled={false}
      onMessage={event => {
        setHeight(parseInt(event.nativeEvent.data));
      }}
      javaScriptEnabled={true}
      // domStorageEnabled={true}
      injectedJavaScript={webViewScript}
      style={[style.description, {height}]}
      containerStyle={[style.description, {height}]}
      source={{uri: TosUrl}}
      originWhitelist={['*']}
    />
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 21,
    marginRight: 21,
    marginTop: 6 + 12,
  },
  icon: {
    width: 23,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
  },
  headerLabel: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 24,
    color: '#02C1CC',
  },
  pageContainer: {
    margin: 18,
  },
  description: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    letterSpacing: -0.33,
    color: '#333',
    marginTop: 3,
    width: '100%',
  },
});
