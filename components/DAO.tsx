import {View, Text, FlatList, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import StarButton from './StarButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { request } from 'graphql-request';
import {Erc20VotingPluginQuery, Erc20Query, MultisigPluginQuery, MultisigQuery} from '../queries'
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import ProposalCard from './ProposalCard';
import Constants from 'expo-constants';
const IPFS_URL = Constants?.manifest?.extra?.ipfsURL;
const IPFS_KEY = Constants?.manifest?.extra?.ipfsKey;
const requestConfig = {'headers': {'X-API-KEY': IPFS_KEY}}
import {Proposal, Plugin} from '../types';


export default function DAOView({navigation, route}: any) {
  const {dao, metadata} = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(true);
  const [proposals, setProposals] = useState<Proposal[]>();
  const [proposalsWithMetadata, setProposalsWithMetadata] = useState<Proposal[]>();
  const [daoPlugin, setDaoPlugin] = useState<Plugin>();

  const backPressed = () => {
    navigation.pop();
  }
  
  const fetchMultisigPlugin = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      MultisigPluginQuery,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      if (loading) setDaoPlugin(data['addresslistPlugins'][0])
    })
  }, [])
  
  const fetchMultisigProposals = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      MultisigQuery,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      if (loading) setProposals(data['addresslistProposals'])
    })
  }, [])
  
  const fetchErc20Plugin = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      Erc20VotingPluginQuery,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      if (data['erc20VotingPlugins'].length && loading) setDaoPlugin(data['erc20VotingPlugins'][0])
      else fetchMultisigPlugin()
    })
  }, [])
  
  const fetchErc20Proposals = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      Erc20Query,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      if (data['erc20VotingProposals'].length && loading) setProposals(data['erc20VotingProposals'])
      else fetchMultisigProposals()
    })
  }, [])
  
  const fetchProposalsMetadata = useCallback(async () => {
    const proposalsMetadata: Proposal[] = await Promise.all(proposals.map(async (proposal: any) => {
      const metadataURI = proposal.metadata
        .includes('ipfs://')
        ? proposal.metadata.slice(7)
        : proposal.metadata
      const response = await axios.post(IPFS_URL+metadataURI, {}, requestConfig)
        .catch((error) => {console.log(error)})
      return {
        ...proposal,
        ...response['data']
      };
    }))
    if(loading) setProposalsWithMetadata(proposalsMetadata)
    setLoading(false)
  }, [proposals]);
  
  useEffect(() => {
    if (!proposals?.length) fetchErc20Proposals();
    if (proposals?.length) { 
      fetchProposalsMetadata();
    } else fetchErc20Plugin();
    
    return () => { setLoading(false) }
  }, [proposals])

  return (
    <SafeAreaView className="bg-gray-50 flex-1" edges={['left', 'right']}>
      <View className="mb-3 p-2 bg-blue-100 rounded-3xl shadow shadow-blue-700/50">
        <View className="flex-row grid grid-cols-4" style={{paddingTop: insets.top}}>
          <View className="w-2/5">
            <TouchableWithoutFeedback
              onPress={backPressed}>
              <Ionicons className="ml-2" name="arrow-back" size={30} color="black" />
            </TouchableWithoutFeedback>
          </View>
          <LinearGradient 
              colors={['rgb(59,130,246)', 'rgb(255,255,255)']}
              className="m-2 p-2 rounded-full rotate-45 grow-0">
            <Text className="w-7 h-7 text-center font-bold text-xl">{dao.name.substring(0, 1)}</Text>
          </LinearGradient>
          <View className="flex-row w-2/5 justify-end">
            <StarButton className="m-3 justify-self-end" daoId={dao.id}/>
            <TouchableWithoutFeedback 
              className="justify-self-end"
              onPress={() => Sharing.shareAsync('https://zaragoza-staging.aragon.org/#/daos/goerli/'+dao.id)}>
              <Ionicons className="ml-2 mr-2" name="share-outline" size={30} color={"black"} />
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View className="m-2">
            <Text className="text-2xl font-black">{dao.name.replace('_', ' ')}</Text>
            <Text className="text-md font-normal pt-2 pb-2">{metadata}</Text> 
        </View>
      </View>
    <View className="bg-gray-50 flex-1">
      { loading && <ActivityIndicator size="large"/> }
      { proposalsWithMetadata?.length && <FlatList
        data={proposalsWithMetadata}
        renderItem={({item}) => <ProposalCard dao={dao} plugin={daoPlugin} proposal={item} navigation={navigation}/>}
        keyExtractor={(proposal) => proposal.id}
      />}
  </View>
    </SafeAreaView>
  )
}