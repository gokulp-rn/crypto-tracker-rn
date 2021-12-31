import React, {useEffect, useCallback, useState} from 'react';
import {StyleSheet, View, Text, FlatList, StatusBar, Alert} from 'react-native';
import {Card, FAB} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import cacheStorage from '../lib/cacheStorage';
import theme from '../lib/theme';
import AmountSummaryView from '../views/AmountSummaryView';
import EmptyView from '../views/EmptyView';
import {fetchAndFormatCoinData} from '../lib/coinCalculations';

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
    backgroundColor: theme.colors.light,
  },
  listContainer: {
    marginBottom: 8,
    marginHorizontal: 8,
    paddingBottom: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.neon_blue,
  },
  listWrapper: {
    padding: 16,
    flexDirection: 'row',
  },
  values: {
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  listHeader: {
    fontSize: 24,
    color: theme.colors.accent,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  column: {
    flex: 1,
  },
  indicator: {
    height: 4,
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
  },
});

const ListItem = ({item, onPress}) => {
  const {
    entryUnits,
    currentEntryValue,
    entryPercentage,
    unitPrice,
    totalPrice,
  } = item || {};
  const isNegative = entryPercentage < 0;

  return (
    <Card
      onPress={onPress}
      style={[
        styles.listContainer,
        {
          borderColor: isNegative
            ? theme.colors.negative
            : theme.colors.positive,
        },
      ]}>
      <View style={styles.listWrapper}>
        <View style={styles.column}>
          <Text>
            Unit Price:
            <Text style={styles.values}> ${unitPrice}</Text>
          </Text>
          <Text>
            Total Price:
            <Text style={styles.values}> ${totalPrice}</Text>
          </Text>
        </View>
        <View style={styles.column}>
          <Text>
            Percentage:
            <Text
              style={[
                styles.values,
                {
                  color: isNegative
                    ? theme.colors.negative
                    : theme.colors.positive,
                },
              ]}>
              {' '}
              {entryPercentage}%
            </Text>
          </Text>
          <Text>
            Current Value:
            <Text style={styles.values}> ${currentEntryValue}</Text>
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: isNegative
              ? theme.colors.negative
              : theme.colors.positive,
          },
        ]}
      />
    </Card>
  );
};

function CoinDetailsScreen({navigation, route}) {
  const {symbol, price} = route?.params || {};
  const [coinData, setCoinData] = useState();

  const getEntries = async () => {
    const formattedCoinData = await fetchAndFormatCoinData(symbol, price);

    setCoinData(formattedCoinData);
  };

  useFocusEffect(
    useCallback(() => {
      getEntries();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    navigation.setOptions({
      title: `${symbol?.toUpperCase()}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const handleDelete = item => {
    Alert.alert('Delete', 'Do you want to delete?', [
      {
        text: 'Yes',
        onPress: async () => {
          const newEntries = coinData?.entries?.filter(
            entry => entry?.id !== item?.id,
          );

          await cacheStorage.setItem(symbol, newEntries);
          getEntries();
        },
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  const {entries, totalInvested, totalUnits} = coinData || {};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {!entries?.length ? (
        <EmptyView />
      ) : (
        <FlatList
          data={entries}
          renderItem={({item}) => (
            <ListItem item={item} onPress={() => handleDelete(item)} />
          )}
          ListHeaderComponent={
            <>
              <AmountSummaryView
                totalInvested={totalInvested}
                totalUnits={totalUnits}
                symbol={symbol}
                price={price}
              />
              <Text style={styles.listHeader}>Entries</Text>
            </>
          }
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate('AddEntry', {symbol});
        }}
      />
    </View>
  );
}

export default CoinDetailsScreen;
