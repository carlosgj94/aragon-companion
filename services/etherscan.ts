import axios from 'axios';
import Constants from 'expo-constants';

const ETHERSCAN_KEY = Constants?.manifest?.extra?.etherscanKey;
const etherscanURL = 'https://api.etherscan.io/api'

export const getBalances = async (addresses: string[]) => {
  const response = await axios(
    etherscanURL +
    '?module=account&action=balancemulti&address=' +
    addresses.toString() +
    '&tag=latest' +
    '&apikey=' +
    ETHERSCAN_KEY
  )
  console.log('Response: ', response)
}