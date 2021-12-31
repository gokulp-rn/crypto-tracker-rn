import FAIcon from 'react-native-vector-icons/FontAwesome';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';

import AppContext from '../contexts/AppContext';
import cacheStorage from '../lib/cacheStorage';
import theme from '../lib/theme';
import axios from '../lib/axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemWrapper: {
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

const ListItem = ({item, selectedCoins, onPress}) => {
  const isSelected = selectedCoins?.includes(item?.symbol?.toLowerCase());

  const handleOnPress = () => {
    onPress(item, isSelected);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <View style={styles.listItemWrapper}>
        <Text>{item?.symbol}</Text>
        {isSelected && (
          <FAIcon color={theme.colors.primary} name="check-circle" size={16} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

function CoinPairSelectScreen() {
  const [coinPairs, setCoinPairs] = useState([]);
  const {getListeningCoinPairs, savedCoinPairs} = useContext(AppContext) || {};
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    axios('exchangeInfo')
      .then(res => {
        setCoinPairs(res?.data?.symbols);
      })
      .catch(err => console.log('err', err));
  }, []);

  const onChangeSearch = query => setSearchQuery(query);

  if (!coinPairs?.length) {
    return (
      <ActivityIndicator
        animating={true}
        color={theme.colors.primary}
        style={styles.loadingContainer}
      />
    );
  }

  const filterdCoinPairs = searchQuery
    ? coinPairs?.filter(coin =>
        coin?.symbol?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
      )
    : coinPairs;

  const handleOnPress = async (coin, isPreviouslySelected) => {
    const newCoinPairs = isPreviouslySelected
      ? savedCoinPairs?.filter(
          selCoin => selCoin?.toLowerCase() !== coin?.symbol?.toLowerCase(),
        )
      : [...savedCoinPairs, coin?.symbol?.toLowerCase()];

    await cacheStorage.setItem('coin_pairs', newCoinPairs);
    getListeningCoinPairs();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        data={filterdCoinPairs}
        renderItem={({item}) => (
          <ListItem
            item={item}
            selectedCoins={savedCoinPairs}
            onPress={handleOnPress}
          />
        )}
        keyExtractor={item => item.symbol}
      />
    </View>
  );
}

export default CoinPairSelectScreen;
