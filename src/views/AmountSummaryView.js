import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Card} from 'react-native-paper';

import theme from '../lib/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neon_blue,
    marginVertical: 16,
    margin: 8,
    borderRadius: 12,
  },
  symbol: {
    color: theme.colors.light,
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  wrapper: {
    padding: 16,
    flexDirection: 'row',
  },
  icon: {
    justifyContent: 'center',
    paddingRight: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  amount: {
    fontSize: 16,
  },
  column: {
    flex: 1,
  },
  label: {
    color: theme.colors.powder_blue,
    paddingBottom: 8,
  },
  indicator: {
    height: 8,
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
  },
});

function AmountSummaryView({
  totalInvested,
  totalUnits,
  price,
  symbol,
  onPress,
}) {
  const currentValue = (totalUnits * parseFloat(price)).toFixed(4);
  const percentage = ((currentValue / totalInvested) * 100 - 100).toFixed(4);
  const isNegative = percentage < 0;

  return (
    <Card elevation={8} style={styles.container} onPress={onPress}>
      <View style={styles.wrapper}>
        <View style={styles.column}>
          <Text style={styles.label}>
            Coin:
            <Text style={styles.symbol}> {symbol}</Text>
          </Text>
          <Text style={styles.label}>
            Invested:
            <Text style={styles.symbol}> ${totalInvested}</Text>
          </Text>
          <Text style={styles.label}>
            Unit Price:
            <Text style={styles.symbol}> ${price}</Text>
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>
            Percentage:
            <Text
              style={[
                styles.symbol,
                {
                  color: isNegative
                    ? theme.colors.negative
                    : theme.colors.positive,
                },
              ]}>
              {' '}
              {percentage}%
            </Text>
          </Text>
          <Text style={styles.label}>
            Current Value:
            <Text style={styles.symbol}> ${currentValue}</Text>
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor:
              percentage < 0 ? theme.colors.negative : theme.colors.positive,
          },
        ]}
      />
    </Card>
  );
}

export default AmountSummaryView;
