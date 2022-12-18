import './shim'
import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'
import WalletConnectProvider from '@walletconnect/react-native-dapp'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WagmiConfig, createClient, configureChains, createStorage } from 'wagmi'
import { noopStorage } from '@wagmi/core'
import { goerli, mainnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { useAccount, useBalance, useConnect, useDisconnect, useSigner, useEnsName, chain } from 'wagmi'
import { createAsyncStoragePersister } from 'react-query/createAsyncStoragePersister'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { useWalletConnect } from '@walletconnect/react-native-dapp'
import Constants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeView from './components/Home';
import DiscoverView from './components/Discover';
import DAOView from './components/DAO';
import ProposalView from './components/Proposal';
import ProfileView from './components/Profile';

const ALCHEMY_KEY_GOERLI = Constants?.manifest?.extra?.alchemyKeyGoerli;
const ALCHEMY_KEY_MAINNET = Constants?.manifest?.extra?.alchemyKeyMainnnet;

import { LogBox } from 'react-native';

// God pls forbid
LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state', ]);

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const DiscoverStack = createNativeStackNavigator();

 
const asyncStoragePersistor = createAsyncStoragePersister({
  storage: AsyncStorage,
})

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [alchemyProvider({ apiKey: ALCHEMY_KEY_MAINNET}), alchemyProvider({ apiKey: ALCHEMY_KEY_GOERLI})],
)

export default function App() {
  const client = createClient({
    persister: asyncStoragePersistor,
    storage: createStorage({
      storage: noopStorage,
    }),
    provider
  })

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
    connector: new WalletConnectConnector({
      chains,
      options: {
        rpc: {
          5: "https://eth-goerli.g.alchemy.com/v2/"+ALCHEMY_KEY_GOERLI,
          1: 'https://eth-mainnet.g.alchemy.com/v2/'+ALCHEMY_KEY_MAINNET
        },
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

  const HomeStackComponent = () => {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen 
          name="Home"
          component={HomeView} 
           options={{
             headerShown: false
           }}       
        />
        <HomeStack.Screen 
          name="DAO" 
          component={DAOView}
          options={{
            headerShown: false
          }}
       />
      <HomeStack.Screen
        name="Proposal"
        component={ProposalView}
        options={{
          presentation: 'modal',
          headerShown: false
        }} 
      />
      </HomeStack.Navigator>
    )
  }

  const DiscoverStackComponent = () => {
    return (
      <DiscoverStack.Navigator>
        <DiscoverStack.Screen 
          name="Discover"
          component={DiscoverView} 
           options={{
            headerShown: false
          }}
        />
        <DiscoverStack.Screen 
          name="DAO" 
          component={DAOView}
          options={{
            headerShown: false
          }}
       />
      <DiscoverStack.Screen
        name="Proposal"
        component={ProposalView}
        options={{
          presentation: 'modal',
          headerShown: false
        }} 
      />
      </DiscoverStack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeView') {
              iconName = focused
                ? 'ios-home'
                : 'ios-home-outline';
            } else if (route.name === 'ProfileView') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'DiscoverView') {
              iconName = focused ? 'search' : 'search-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen 
          name="HomeView" 
          component={HomeStackComponent}
          options={{
            title: 'Home',
            headerShown: false
          }}
         />
        <Tab.Screen 
          name="DiscoverView" 
          component={DiscoverStackComponent}
          options={{
            title: 'Discover',
            headerShown: false
          }}
         />
        <Tab.Screen 
          name="ProfileView" 
          children={(props) => <ProfileView {...props} connector={connector} account={account} />}
          options={{
            title: 'Profile',
            headerShown: false
          }}
       />
      </Tab.Navigator>
    </NavigationContainer>
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
