import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, FlatList, Image, Pressable} from 'react-native';

import {CommonActions} from '@react-navigation/native';

import {getArticles} from '@helpers';

import {navRef} from '@pages';
import Icons from '@icons';

export default ({navigation, route}) => {
  const initialPagination = {
    perPage: 10,
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
      getArticles({
        filter: {
          fields: ['id', 'title', 'image', 'videoUrl'],
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
      numColumns={2}
    />
  );
};

const Item = ({item}) => {
  // item.description = item.description
  //   .replace(/\<[^\>]*\>/gi, ' ')
  //   .replace('&nbsp;', ' ')
  //   .replace(/\s{2,}/g, ' ')
  //   .trim()
  //   .substring(0, 150);

  return (
    <Pressable
      style={style.itemContainer}
      onPress={() => {
        navRef().dispatch(CommonActions.navigate('Article', {id: item.id}));
      }}>
      <View>
        <Image style={style.itemImage} source={{uri: item.image}} />
        {item.videoUrl.length ? (
          <View style={[style.itemImage, style.itemImageVideoOverlayContainer]}>
            <Image
              style={style.itemImageVideoOverlayIcon}
              source={Icons.play}
            />
          </View>
        ) : null}
      </View>
      <View style={style.itemSide}>
        <Text style={style.itemLabel} numberOfLines={2} ellipsizeMode={'tail'}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
};

const ItemSeparator = () => <View style={style.separator} />;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeContainer: {
    marginTop: 21,
    marginLeft: 21,
    marginRight: 21,
  },
  list: {
    marginBottom: 50,
  },
  separator: {height: 17},
  itemContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  itemImage: {
    width: '100%',
    resizeMode: 'contain',
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 4,
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
  itemSide: {
    marginTop: 10,
    flex: 1,
  },
  itemLabel: {
    fontFamily: 'WorkSans-Semibold',
    fontSize: 16,
    letterSpacing: -0.4,
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
