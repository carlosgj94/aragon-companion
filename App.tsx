import './shim'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import WalletConnectProvider from '@walletconnect/react-native-dapp'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WagmiConfig, createClient, createStorage } from 'wagmi'
import { noopStorage } from '@wagmi/core'
import { createAsyncStoragePersister } from 'react-query/createAsyncStoragePersister'
import Account from './components/Account'

const asyncStoragePersistor = createAsyncStoragePersister({
  storage: AsyncStorage,
})

const client = createClient({
  persister: asyncStoragePersistor,
  storage: createStorage({
    storage: noopStorage,
  }),
})

export default function App() {
  return (
    <WagmiConfig client={client}>
      <WalletConnectProvider
        redirectUrl={'wmw://app'}
        storageOptions= {{
          // @ts-expect-error: Internal
          asyncStorage: AsyncStorage,
        }}>
        <View style={styles.container}>
          <Account />
          <StatusBar style="auto" />
        </View>
      </WalletConnectProvider>
    </WagmiConfig>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
