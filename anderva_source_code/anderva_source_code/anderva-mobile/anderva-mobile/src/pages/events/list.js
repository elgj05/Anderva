import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, FlatList, Image, Pressable} from 'react-native';

import {CommonActions} from '@react-navigation/native';

import {getEvents} from '@helpers';

import {navRef} from '@pages';
import Icons from '@icons';
import EventButton from '@components/EventButton';

import moment from 'moment';
import 'moment/locale/sq';
moment.updateLocale('sq', {
  calendar: {
    lastDay: '[DJE NË] LT',
    sameDay: '[SOT NË] LT',
    nextDay: '[NESËR NË] LT',
    lastWeek: 'dddd [E KALUAR] [NË] LT',
    nextWeek: 'dddd [NË] LT',
    sameElse: 'LLLL',
  },
});

export default ({navigation, route}) => {
  const initialPagination = {
    perPage: 5,
    list: [],
    totalPages: 0,
    page: 0,
    loading: false,
    refreshing: false,
    noMoreData: false,
  };
  const [pagination, setPagination] = useState(initialPagination);
  const [fetching, setFetching] = useState(0);

  const getData = (setParams = {}) => {
    setPagination(prevState => ({...prevState, ...setParams}));
    setFetching(new Date().getTime() / 1000);
  };

  useEffect(() => {
    getData({loading: true});
  }, []);

  // useEffect(() => {
  //   getData({...initialPagination, loading: true});
  // }, [route.params?.categoryId]);

  // useEffect(() => {
  //   if (!pagination.loading && !pagination.refreshing) {
  //     getData({...initialPagination, loading: true});
  //   }
  // }, [route?.params?.search]);

  // useEffect(() => {
  //   if (!pagination.loading && !pagination.refreshing) {
  //     getData({...initialPagination, refreshing: true});
  //   }
  // }, [route?.params?.refreshNow]);

  useEffect(() => {
    fetching !== 0 &&
      getEvents({
        filter: {
          fields: ['id', 'title', 'image', 'datetimeStart', 'location'],
          skip: pagination.page * pagination.perPage,
          limit: pagination.perPage,
          order: ['createdAt ASC'],
          // where: route.params?.categoryId
          //   ? {categoryId: route.params?.categoryId}
          //   : route.params?.search
          //   ? {
          //       or: [
          //         {name: {like: route.params?.search, options: 'i'}},
          //         {phone: {like: route.params?.search, options: 'i'}},
          //         // {"category.name": {like: route.params?.search, options: 'i'}},
          //         {locationAddress: {like: route.params?.search, options: 'i'}},
          //       ],
          //     }
          //   : {},
        },
      }).then(res => {
        setPagination(prevState => {
          if (!res || !res.data) {
            return prevState;
          }

          let state = {
            loading: false,
            refreshing: false,
          };
          if (res.data.data.length === 0) {
            state.noMoreData = true;
          } else {
            state.totalPages = Math.ceil(res.data.count / pagination.perPage);
            state.list = prevState.refreshing
              ? res.data.data
              : [...prevState.list, ...res.data.data];
          }
          return {...prevState, ...state};
        });
      });
  }, [fetching]);

  const footer = () => {
    const finished = pagination.noMoreData;
    const msg = finished
      ? 'Arritët në fund'
      : 'Duke ngarkuar të dhëna të reja...';
    return pagination.page !== 0 ? (
      <View style={style.footer}>
        <Text style={style.footerLabel}>{msg}</Text>
      </View>
    ) : null;
  };

  const empty = () => {
    const refreshingTop = pagination.refreshing && !pagination.noMoreData;
    const msg =
      pagination.loading || refreshingTop
        ? 'Duke u ngarkuar...'
        : 'Nuk ka të dhëna';
    return (
      <View style={style.footer}>
        <Text style={style.footerLabel}>{msg}</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={style.list}
      data={pagination.list}
      renderItem={Item}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={() => {
        if (
          !pagination.noMoreData &&
          !pagination.loading &&
          !pagination.refreshing
        ) {
          getData({page: pagination.page + 1, loading: true});
        }
      }}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshing={pagination.refreshing}
      onRefresh={() => {
        if (!pagination.loading && !pagination.refreshing) {
          getData({...initialPagination, refreshing: true});
        }
      }}
      ListFooterComponent={footer}
      ListEmptyComponent={empty}
      // numColumns={2}
    />
  );
};

const Item = ({item}) => {
  const time = moment(item.datetimeStart).calendar();

  return (
    <View style={style.itemContainer}>
      <View>
        <Image style={style.itemImage} source={{uri: item.image}} />
      </View>
      <View style={style.itemSide}>
        <Text style={style.itemTime}>{time}</Text>
        <Text style={style.itemLabel} numberOfLines={2} ellipsizeMode={'tail'}>
          {item.title}
        </Text>
        <Text style={style.itemLocation}>{item.location}</Text>

        <EventButton
          onPress={() => {
            navRef().dispatch(CommonActions.navigate('Event', {id: item.id}));
          }}>
          {'Më Shumë'}
        </EventButton>
      </View>
    </View>
  );
};

const ItemSeparator = () => <View style={style.separator} />;

const style = StyleSheet.create({
  list: {
    // marginTop: 21,
    paddingTop: 21,
    marginBottom: 50,
  },
  separator: {height: 21},
  itemContainer: {
    flex: 1,
    // paddingHorizontal: 5,
    marginHorizontal: 21,
    backgroundColor: '#fff',
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  itemSide: {
    // marginTop: 10,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  itemTime: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 15,
    letterSpacing: -0.31,
    color: '#333',
    paddingBottom: 6,
    textTransform: 'uppercase',
  },
  itemLabel: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 17,
    letterSpacing: -0.35,
    color: '#333',
    paddingBottom: 6,
  },
  itemLocation: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    letterSpacing: -0.3,
    color: '#333',
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  footer: {
    marginVertical: 24,
  },
  footerLabel: {
    textAlign: 'center',
    fontFamily: 'WorkSans-Regular',
    color: '#888',
    fontSize: 13,
  },
});
