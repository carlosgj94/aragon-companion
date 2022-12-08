import './shim'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'
import WalletConnectProvider from '@walletconnect/react-native-dapp'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WagmiConfig, createClient, createStorage } from 'wagmi'
import { noopStorage } from '@wagmi/core'
import { useAccount, useBalance, useConnect, useDisconnect, useSigner, useEnsName, chain } from 'wagmi'
import { createAsyncStoragePersister } from 'react-query/createAsyncStoragePersister'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { useWalletConnect } from '@walletconnect/react-native-dapp'
import Constants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeView from './components/Home'

const ALCHEMY_KEY = Constants?.manifest?.extra?.alchemyKey;

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

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
        <Navigation/>
        <StatusBar style="auto" />
      </WalletConnectProvider>
    </WagmiConfig>
  )
}

const Navigation = () => {
  const connector = useWalletConnect()

  const { connect } = useConnect({
    chainId: chain.goerli.id,
    connector: new WalletConnectConnector({
      // chains: [chain.goerli],
      options: {
        rpc: {5: "https://eth-goerli.g.alchemy.com/v2/"+ALCHEMY_KEY},
        qrcode: true,
        connector,
      },
    }),
  })
  const { disconnect } = useDisconnect()
  //  <Button title="Disconnect" onPress={() => connector?.killSession()} />

  const { data: account } = useAccount()
  // const { data: signer, isError, isLoading } = useSigner()

  useEffect(() => {
    if (connector?.accounts?.length && !account) {
      connect()
    } else {
      disconnect()
    }
  }, [connector])

  const HeaderRight = () => (
    <>
      {
        account?.address
          ?  (<EnsView address={account?.address}/>)
          : ( <Button className="bg-black" title="Connect" onPress={() => connector?.connect()} /> )
      }
    </>
  )

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-home'
                : 'ios-home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-settings' : 'ios-settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen 
          name="Home" 
          component={HomeView}
          options={{
            headerRight: HeaderRight
          }}
         />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const EnsView = ({address}) => {
  const { data, isError, isLoading } = useEnsName({ address, chainId: 1 })
  return (
    <>
    { 
      !isError ? (<Text>{data}</Text>) : (<Text>{address}</Text>)
    }
    </>
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
