import React, {useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {FAB, TextInput} from 'react-native-paper';
import cacheStorage from '../lib/cacheStorage';
import uid from '../lib/generateId';
import theme from '../lib/theme';

const styles = StyleSheet.create({
  fab: {
    backgroundColor: theme.colors.neon_blue,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: theme.colors.light,
    flex: 1,
  },
  input: {
    backgroundColor: theme.colors.light,
    marginTop: 16,
    marginHorizontal: 16,
  },
});

function AddEntryScreen({navigation, route}) {
  const {symbol} = route?.params || {};
  const [unitPrice, setUnitPrice] = useState();
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    navigation.setOptions({
      title: `Add Entry for ${symbol?.toUpperCase()}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const onPressSubmit = async () => {
    const hasValidData = unitPrice?.length > 0 && totalPrice?.length > 0;

    if (!hasValidData) {
      return;
    }
    const entries = (await cacheStorage.getItem(symbol)) || [];

    const newEntries = [
      ...entries,
      {
        unitPrice,
        totalPrice,
        id: uid(),
      },
    ];

    await cacheStorage.setItem(symbol, newEntries);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        autoFocus
        label="Unit Price"
        value={unitPrice}
        onChangeText={text => setUnitPrice(text)}
        mode="outlined"
        style={styles.input}
        keyboardType="number-pad"
      />

      <TextInput
        label="Total Price"
        value={totalPrice}
        onChangeText={text => setTotalPrice(text)}
        mode="outlined"
        style={styles.input}
        keyboardType="number-pad"
      />
      <FAB style={styles.fab} icon="check" onPress={onPressSubmit} />
    </View>
  );
}

export default AddEntryScreen;
