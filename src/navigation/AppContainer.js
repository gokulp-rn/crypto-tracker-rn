import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider as PaperProvider} from 'react-native-paper';

import AppContext from '../contexts/AppContext';
import cacheStorage from '../lib/cacheStorage';
import CoinPairSelectScreen from '../screens/CoinPairSelectScreen';
import HomeScreen from '../screens/HomeScreen';
import CoinDetailsScreen from '../screens/CoinDetailsScreen';
import AddEntryScreen from '../screens/AddEntryScreen';

const MainStack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        component={HomeScreen}
        options={{header: () => null}}
      />
      <MainStack.Screen
        name="CoinPairSelect"
        component={CoinPairSelectScreen}
      />
      <MainStack.Screen name="CoinDetails" component={CoinDetailsScreen} />
      <MainStack.Screen name="AddEntry" component={AddEntryScreen} />
    </MainStack.Navigator>
  );
};

function AppContainer() {
  const [marketData, setMarketData] = useState([]);
  const [savedCoinPairs, setSavedCoinPairs] = useState([]);

  const getListeningCoinPairs = async () => {
    const coinPairs = (await cacheStorage.getItem('coin_pairs')) || [];

    setSavedCoinPairs(coinPairs);
  };

  useEffect(() => {
    getListeningCoinPairs();
  }, []);

  return (
    <AppContext.Provider
      value={{
        marketData,
        setMarketData,
        savedCoinPairs,
        getListeningCoinPairs,
      }}>
      <PaperProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AppContext.Provider>
  );
}

export default AppContainer;
