function decimalPlacesIfCents(amount, points = 4) {
  return amount % 1 !== 0 ? amount.toFixed(points) : amount;
}

export {decimalPlacesIfCents};
