import cacheStorage from './cacheStorage';
import {decimalPlacesIfCents} from './numberHelpers';

const fetchAndFormatCoinsData = (marketData, savedCoinPairs) => {
  const coinsData = savedCoinPairs?.reduce(async (coinsResult, savedCoin) => {
    const coinEntries = (await cacheStorage.getItem(savedCoin)) || [];
    const newResult = await coinsResult;
    const price = marketData?.[savedCoin];
    if (!price) {
      return coinsResult;
    }

    const coinData = coinEntries?.reduce(
      (coinResult, entry) => {
        const newInvested =
          coinResult?.investedPrice + parseFloat(entry?.totalPrice) || 0;
        const newUnits =
          coinResult?.units +
          parseFloat(entry?.totalPrice) / parseFloat(entry?.unitPrice);

        return {
          investedPrice: newInvested,
          units: newUnits,
        };
      },
      {investedPrice: 0, units: 0},
    );

    const currentPrice = parseFloat(price);
    const currentValue = decimalPlacesIfCents(
      coinData?.units * currentPrice,
      2,
    );
    const percentage = decimalPlacesIfCents(
      (currentValue / coinData?.investedPrice) * 100 - 100,
      2,
    );

    const totalInvested = newResult?.totalInvested + coinData?.investedPrice;
    const currentTotal = newResult?.currentTotal + parseFloat(currentValue);

    return {
      coins: [
        ...newResult?.coins,
        {
          ...coinData,
          currentValue,
          percentage,
          symbol: savedCoin,
          entries: coinEntries,
          currentPrice,
        },
      ],
      totalInvested,
      currentTotal,
    };
  }, Promise.resolve({coins: [], totalInvested: 0, currentTotal: 0}));

  return coinsData;
};

const fetchAndFormatCoinData = async (coinSymbol, price) => {
  const coinEntries = await cacheStorage.getItem(coinSymbol);

  const coinData = coinEntries?.reduce(
    (result, entry) => {
      const totalInvested =
        result?.totalInvested + parseFloat(entry?.totalPrice);
      const totalUnits =
        result?.totalUnits +
        parseFloat(entry?.totalPrice) / parseFloat(entry?.unitPrice);

      const entryUnits =
        parseFloat(entry?.totalPrice) / parseFloat(entry?.unitPrice);
      const currentEntryValue = decimalPlacesIfCents(
        entryUnits * parseFloat(price),
      );
      const entryPercentage = decimalPlacesIfCents(
        (currentEntryValue / parseFloat(entry?.totalPrice)) * 100 - 100,
      );

      const formattedEntry = {
        ...entry,
        entryUnits,
        currentEntryValue,
        entryPercentage,
      };

      return {
        totalInvested,
        totalUnits,
        entries: [...result?.entries, formattedEntry],
      };
    },
    {totalInvested: 0, totalUnits: 0, entries: []},
  );

  return coinData;
};

export {fetchAndFormatCoinsData, fetchAndFormatCoinData};
