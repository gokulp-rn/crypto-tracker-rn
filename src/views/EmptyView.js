import React from 'react';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {View, StyleSheet, Text} from 'react-native';

import theme from '../lib/theme';

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 16,
    paddingHorizontal: 32,
  },
});

const EmptyView = () => (
  <View style={styles.emptyContainer}>
    <FA5Icon
      color={theme.colors.egyptian_blue}
      name="clipboard-list"
      size={32}
      style={styles.icon}
    />
    <Text style={styles.emptyText}>
      {'Looks like there is no entries, \nclick + button to add one'}
    </Text>
  </View>
);

export default EmptyView;
