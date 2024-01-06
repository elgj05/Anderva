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

import icons from '@icons';
import Header from './header';
import {getBusiness, openUrl} from '@helpers';
import CallButton from '@components/CallButton';
import GetCoupon from '@components/GetCoupon';
import Button from '@components/Button';

import Coupon from './coupon';

export default ({navigation, route}) => {
  const [item, setItem] = useState({});
  const [visibleCouponModal, setVisibleCouponModal] = useState(false);

  useEffect(() => {
    setItem({});
    if (route?.params?.id) {
      getBusiness(route.params.id).then(res => {
        if (res && res.data) {
          setItem(res.data);
        }
      });
    }
  }, [route?.params?.id]);

  return (
    <View style={style.container}>
      <Header navigation={navigation} />
      <Coupon
        code={item?.couponCode}
        description={item?.couponDescription}
        visible={visibleCouponModal}
        setVisible={setVisibleCouponModal}
      />
      <View>
        {item.id ? (
          <Business item={item} setVisibleCouponModal={setVisibleCouponModal} />
        ) : (
          <Loading />
        )}
      </View>
    </View>
  );
};

const Loading = () => {
  return <Text style={style.loading}>Loading...</Text>;
};

const Business = ({item, setVisibleCouponModal}) => {
  // TODO: couponCode, couponDescription

  return (
    <ScrollView
      style={style.pageContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={style.imageContainer}>
        <Image style={style.image} source={{uri: item.image}} />
      </View>

      <Text style={style.titleLabel}>{item.name}</Text>
      <Text style={style.categoryLabel}>{item.category?.name}</Text>

      <View style={style.buttonsContainer}>
        <CallButton
          label="TELEFONO"
          onPress={() => Linking.openURL('tel:' + item.phone.replace(' ', ''))}
        />
        <GetCoupon
          label="PËRDOR KUPONIN"
          onPress={() => setVisibleCouponModal(true)}
        />
      </View>

      <Text style={style.locationLabel}>Vendodhja</Text>
      <Pressable
        onPress={() => {
          Linking.openURL(item.locationUrl);
        }}>
        <Text style={style.locationLink}>{item.locationAddress}</Text>
      </Pressable>

      <Text style={style.descriptionLabel}>Përshkrimi</Text>
      <Html html={item.description} />
      <View style={{height: 40}}></View>
      <Button
        onPress={() => {
          openUrl(item.moreInfoUrl);
        }}>
        {'Më Shumë'}
      </Button>
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
  ${html}
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
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 8,
  },
  titleLabel: {
    marginTop: 20,
    marginBottom: 5,
    fontFamily: 'WorkSans-Semibold',
    fontSize: 24,
    letterSpacing: -0.57,
  },
  categoryLabel: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 16,
    letterSpacing: -0.33,
    color: '#02C1CC',
  },
  buttonsContainer: {
    marginVertical: 25,
    flexDirection: 'row',
  },
  locationLabel: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 16,
    letterSpacing: -0.33,
    color: '#333',
  },
  locationLink: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    letterSpacing: -0.33,
    color: '#02C1CC',
    textDecorationLine: 'underline',
  },
  descriptionLabel: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 16,
    letterSpacing: -0.33,
    color: '#333',
    marginTop: 20,
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
