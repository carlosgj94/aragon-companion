import axios from 'axios';
import Constants from 'expo-constants';

const ETHERSCAN_KEY = Constants?.manifest?.extra?.etherscanKey;
const etherscanURL = 'https://api.etherscan.io/api'


export const getTokenHolders = async (token: string) => {
  const response = await axios.get(
    etherscanURL +
    '?module=token' +
    '&action=tokenholderlist' +
    '&contractaddress=' +
    token +
    '&page=1' +
    '&offset=100' +
    '&apikey=' +
    ETHERSCAN_KEY
  )
  console.log('Holders List: ', response)
}

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