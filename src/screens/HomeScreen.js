import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {FAB} from 'react-native-paper';

import AppContext from '../contexts/AppContext';
import axios from '../lib/axios';
import {fetchAndFormatCoinsData} from '../lib/coinCalculations';
import theme from '../lib/theme';
import CoinCardView from '../views/CoinCardView';
import EmptyView from '../views/EmptyView';
import HomeHeaderView from '../views/HomeHeaderView';

const styles = StyleSheet.create({
  fab: {
    backgroundColor: theme.colors.neon_blue,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  listContainer: {
    top: -24,
  },
});

// const MOCK = {
//   ltcbtc: '0.00309300',
//   bnbbtc: '0.00309300',
//   neobtc: '0.00309300',
//   manausdt: '3.57470000',
// };

function HomeScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const [formattedCoinData, setFormattedCoinData] = useState();
  const {marketData, savedCoinPairs, setMarketData} =
    useContext(AppContext) || {};

  const getLivePrice = () => {
    setRefreshing(true);

    axios('ticker/price')
      .then(res => {
        const formattedMarketData = res?.data?.reduce((obj, item) => {
          return {
            ...obj,
            [item?.symbol?.toLowerCase()]: item?.price,
          };
        }, {});
        setMarketData(formattedMarketData);
        // console.log('api', formattedMarketData, savedCoinPairs)
        getCoinDataFromStorage();
        setRefreshing(false);
      })
      .catch(err => {
        setRefreshing(false);
        console.log('err', err);
      });
  };

  useEffect(() => {
    // setMarketData(MOCK);
    getLivePrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCoinDataFromStorage = async () => {
    if (!Object.keys(marketData)?.length || !savedCoinPairs?.length) {
      return;
    }
    const coinData = await fetchAndFormatCoinsData(marketData, savedCoinPairs);
    setFormattedCoinData(coinData);
  };

  useFocusEffect(
    useCallback(() => {
      getCoinDataFromStorage();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketData, savedCoinPairs]),
  );

  const onRefresh = () => {
    getLivePrice();
  };

  console.log('formattedCoinData', formattedCoinData);

  const {coins, currentTotal, totalInvested} = formattedCoinData || {};

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <HomeHeaderView
        totalInvested={totalInvested}
        currentTotal={currentTotal}
      />
      {!savedCoinPairs?.length ? (
        <EmptyView />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={coins}
          renderItem={({item}) => (
            <CoinCardView
              {...item}
              onPress={() => {
                navigation.navigate('CoinDetails', {
                  price: item?.currentPrice,
                  symbol: item?.symbol,
                });
              }}
            />
          )}
          style={styles.listContainer}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate('CoinPairSelect');
        }}
      />
    </View>
  );
}

export default HomeScreen;
