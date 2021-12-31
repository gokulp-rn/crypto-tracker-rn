import React from 'react';
import {View, StyleSheet, Text, ImageBackground} from 'react-native';
import {Card} from 'react-native-paper';

import cryptoBgImage from '../assets/images/cryptoBg.png';
import theme from '../lib/theme';

const styles = StyleSheet.create({
  bgImage: {
    height: 240,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    marginTop: 64,
    marginBottom: 48,
    marginHorizontal: 16,
    padding: 16,
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    flex: 1,
  },
  column: {
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  value: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    fontSize: 24,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.neon_blue,
    borderRadius: 4,
  },
  headerLabel: {
    fontSize: 16,
  },
  amountWrapper: {
    flex: 1,
    alignItems: 'center',
  },
});

function HomeHeaderView({currentTotal, totalInvested}) {
  const percentage = ((currentTotal / totalInvested) * 100 - 100).toFixed(4);

  return (
    <ImageBackground source={cryptoBgImage} style={styles.bgImage}>
      <Card style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.column}>
            <Text style={styles.headerLabel}>Invested</Text>
            <View style={styles.amountWrapper}>
              <Text style={styles.value}>${totalInvested || 0}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.column}>
            <Text style={styles.headerLabel}>Current</Text>
            <View style={styles.amountWrapper}>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      percentage < 0
                        ? theme.colors.negative
                        : theme.colors.positive,
                  },
                ]}>
                ${currentTotal || 0}
              </Text>
              {!isNaN(percentage) && (
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
              )}
            </View>
          </View>
        </View>
      </Card>
    </ImageBackground>
  );
}

export default HomeHeaderView;
