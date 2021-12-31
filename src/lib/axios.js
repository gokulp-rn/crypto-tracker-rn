import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3/';

export default axios.create({
  baseURL: BASE_URL,
});
