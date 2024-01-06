import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  ScrollView,
  Linking,
} from 'react-native';

import {WebView} from 'react-native-webview';

import Icons from '@icons';
import Header from './header';
import {getArticle, getYoutubeId} from '@helpers';

export default ({navigation, route}) => {
  const [item, setItem] = useState({});

  useEffect(() => {
    setItem({});
    if (route?.params?.id) {
      getArticle(route.params.id).then(res => {
        if (res && res.data) {
          let videoId = null;
          if (res.data.videoUrl.length) {
            const vid = getYoutubeId(res.data.videoUrl);
            videoId = vid[1] ? vid[1] : null;
          }
          setItem({...res.data, videoId});
        }
      });
    }
  }, [route?.params?.id]);

  return (
    <View style={style.container}>
      <Header navigation={navigation} />
      <View>{item.id ? <Article item={item} /> : <Loading />}</View>
    </View>
  );
};

const Loading = () => {
  return <Text style={style.loading}>Loading...</Text>;
};

const Article = ({item}) => {
  return (
    <ScrollView
      style={style.pageContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <Text style={style.titleLabel}>{item.title}</Text>
      {item.videoId ? (
        <WebView
          scrollEnabled={false}
          javaScriptEnabled={true}
          style={style.video}
          source={{
            uri:
              'https://www.youtube.com/embed/' +
              item.videoId +
              '?rel=0&autoplay=0&showinfo=0&controls=0',
          }}
          originWhitelist={['*']}
        />
      ) : (
        <View style={style.imageContainer}>
          <Image style={style.image} source={{uri: item.image}} />
        </View>
      )}

      <Html html={item.description} />
      <View style={{height: 60}}></View>
    </ScrollView>
  );
};

const Html = ({html}) => {
  html = `
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8;charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=1" />
</head>
<body style="margin: 0;padding: 0;">
  <p>${html}</p>
</body>
</html>
`;
  const webViewScript = `
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); 
    }, 100);
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  const [height, setHeight] = useState(0);
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
      source={{html}}
      originWhitelist={['*']}
    />
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loading: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 30,
    color: '#888',
  },
  pageContainer: {
    margin: 18,
  },
  imageContainer: {
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 7,
    marginVertical: 15,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 2,
  },
  itemImageVideoOverlayContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  itemImageVideoOverlayIcon: {
    width: 30,
    height: 30,
  },
  titleLabel: {
    // marginTop: 20,
    // marginBottom: 5,
    fontFamily: 'WorkSans-Semibold',
    fontSize: 24,
    letterSpacing: -0.57,
  },
  description: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    letterSpacing: -0.33,
    color: '#333',
    marginTop: 3,
    width: '100%',
  },
  video: {
    flex: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    resizeMode: 'contain',
    marginVertical: 15,
  },
});
