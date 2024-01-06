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
import {getEvent, openUrl} from '@helpers';
import Button from '@components/Button';

import moment from 'moment';
import 'moment/locale/sq';
moment.updateLocale('sq');

export default ({navigation, route}) => {
  const [item, setItem] = useState({});

  useEffect(() => {
    setItem({});
    if (route?.params?.id) {
      getEvent(route.params.id).then(res => {
        if (res && res.data) {
          setItem(res.data);
        }
      });
    }
  }, [route?.params?.id]);

  return (
    <View style={style.container}>
      <Header navigation={navigation} />
      <View>{item.id ? <Event item={item} /> : <Loading />}</View>
    </View>
  );
};

const Loading = () => {
  return <Text style={style.loading}>Loading...</Text>;
};

const Event = ({item}) => {
  const startdate = moment(item.datetimeStart).format('D MMMM, YYYY');
  const enddate = moment(item.datetimeEnd).format('D MMMM, YYYY');
  const date = startdate === enddate ? startdate : startdate + '\n- ' + enddate;

  const starttime = moment(item.datetimeStart).format('k:mm A');
  const endtime = moment(item.datetimeEnd).format('k:mm A');
  const time = starttime + ' - ' + endtime;

  const day = moment(item.datetimeStart).format('dddd');

  return (
    <ScrollView
      style={style.pageContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <Text style={style.titleLabel}>{item.title}</Text>
      <View style={style.imageContainer}>
        <Image style={style.image} source={{uri: item.image}} />
      </View>

      <View style={style.eventBar}>
        <View style={style.eventBarItem}>
          <Image source={Icons.calendar} style={style.icon} />
          <View style={style.timeContainer}>
            <Text style={style.timeBold}>{date}</Text>
            <Text style={style.timeRegular}>{day}</Text>
          </View>
        </View>
        <View style={style.eventBarItem}>
          <Image source={Icons.time} style={style.icon} />
          <View style={style.timeContainer}>
            <Text style={style.timeBold}>{time}</Text>
            <Text style={style.timeRegular}>{item.location}</Text>
          </View>
        </View>
      </View>

      <Html html={item.description} />

      <View style={style.buttonContainer}>
        <Button onPress={() => openUrl(item.eventUrl)}>Ndiq Eventin</Button>
      </View>
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
    marginVertical: 18,
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
  eventBar: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(2,193,204,0.08)',
    paddingHorizontal: 21,
    paddingVertical: 7,
    flexDirection: 'row',
  },
  eventBarItem: {
    flex: 1,
    flexDirection: 'row',
  },
  titleLabel: {
    // marginTop: 20,
    // marginBottom: 5,
    fontFamily: 'WorkSans-Semibold',
    fontSize: 24,
    letterSpacing: -0.57,
    // textAlign: 'center',
    paddingHorizontal: 21,
  },
  description: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    letterSpacing: -0.33,
    color: '#333',
    width: '100%',
    paddingHorizontal: 21,
  },
  buttonContainer: {
    marginHorizontal: 21,
    marginTop: 30,
    marginBottom: 50,
  },
  icon: {
    width: 34,
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1,
    marginVertical: 8,
    marginRight: 12,
  },
  timeContainer: {
    justifyContent: 'space-evenly',
  },
  timeBold: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 15,
    letterSpacing: -0.33,
    color: '#333',
  },
  timeRegular: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 15,
    letterSpacing: -0.33,
    color: '#333',
  },
});
