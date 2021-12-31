import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Card} from 'react-native-paper';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

import theme from '../lib/theme';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginHorizontal: 8,
    padding: 16,
  },
  symbol: {
    color: theme.colors.fuscous_gray,
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  wrapper: {
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
    color: theme.colors.accent,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
});

function CoinCardView({
  currentPrice,
  symbol,
  onPress,
  percentage,
  investedPrice,
  currentValue,
}) {
  if (!currentPrice) {
    return null;
  }

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.wrapper}>
        <FA5Icon
          color={percentage < 0 ? theme.colors.negative : theme.colors.positive}
          name="bitcoin"
          size={32}
          style={styles.icon}
        />
        <View style={styles.details}>
          <View>
            <Text style={styles.symbol}>{symbol}</Text>
            <Text>Invested: ${investedPrice || 0}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.amount}>${currentPrice}</Text>
            {!isNaN(percentage) && (
              <Text>
                ${currentValue || 0}
                <Text
                  style={{
                    color:
                      percentage < 0
                        ? theme.colors.negative
                        : theme.colors.positive,
                  }}>
                  {' '}
                  ({percentage}%)
                </Text>
              </Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

export default CoinCardView;
