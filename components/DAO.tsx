import {View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import { request, gql } from 'graphql-request';
import { useState, useEffect, useCallback } from 'react';
import StarButton from './StarButton';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const erc20Query = gql`
  query proposals($limit:Int!, $dao:String!) {
    erc20VotingProposals(first: $limit, where: {dao: $dao}) {
      id
      creator
      metadata
      executed
      createdAt
      yes
      no
      abstain
      open
    }
  }
`

const multisigQuery = gql`
  query proposals($limit:Int!, $dao:String!) {
    addresslistProposals(first: $limit, where: {dao: $dao}) {
      id
      creator
      metadata
      executed
      createdAt
      yes
      no
      open
    }
  }
`
type Proposal = {
  id: string;
  creator: string;
  metadata: string;
  executed: boolean;
  createdAt: string;
  yes: string;
  no: string;
  abstain: string;
  open: string;
}
type ProposalWithMetadata = {
  id: string;
  creator: string;
  // metadata: string;
  resources: string[];
  summary: string;
  title: string;
  executed: boolean;
  createdAt: string;
  yes: string;
  no: string;
  abstain: string;
  open: string;
}

const ProposalCard = ({proposal, navigation}: any) => {
  const proposalClicked = () => {
    navigation.push('Proposal', {proposal, navigation});
  }
  return (
    <TouchableWithoutFeedback
      onPress={proposalClicked}>
      <View className="block m-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <Text className="text-md text-lg font-bold">{proposal.title}</Text>
        <Text>Yes: {proposal.yes}</Text>
        <Text>No: {proposal.no}</Text>
        <Text>Abstain: {proposal.abstain}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default function DAOView({navigation, route}: any) {
  const {dao, metadata} = route.params;
  const [proposals, setProposals] = useState<Proposal[]>();
  const [proposalsWithMetadata, setProposalsWithMetadata] = useState<ProposalWithMetadata[]>();

  const backPressed = () => {
    navigation.pop();
  }
  
  const fetchMultisigProposals = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      multisigQuery,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      setProposals(data['addresslistProposals'])
    })
  }, [])
  
  
  const fetchErc20Proposals = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      erc20Query,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      if (data['erc20VotingProposals'].length) setProposals(data['erc20VotingProposals'])
      else fetchMultisigProposals()
    })
  }, [])
  
  const fetchProposalsMetadata = useCallback(async () => {
    const proposalsMetadata: ProposalWithMetadata[] = await Promise.all(proposals.map(async (proposal: any) => {
      const metadataURI = proposal.metadata
        .includes('ipfs://')
        ? proposal.metadata.slice(7)
        : proposal.metadata
      const response = await axios.get('https://api.ipfsbrowser.com/ipfs/get.php?hash='+metadataURI)
      return {
        ...proposal,
        ...response['data']
      };
    }))
    setProposalsWithMetadata(proposalsMetadata)
  }, [proposals]);
  
  useEffect(() => {
    if (!proposals?.length) fetchErc20Proposals();
    if (proposals?.length) fetchProposalsMetadata();
  }, [proposals])

  return (
    <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>
      <View className="block border-b border-gray-200 shadow-md">
        <View className="flex-row items-center justify-between">
          <TouchableWithoutFeedback
            onPress={backPressed}>
            <Ionicons className="ml-2" name="arrow-back" size="30" color="black" />
          </TouchableWithoutFeedback>
          <LinearGradient 
              colors={['rgb(59,130,246)', 'rgb(255,255,255)']}
              className="m-2 p-2 rounded-full rotate-45">
            <Text className="w-7 h-7 text-center font-bold text-xl">{dao.name.substring(0, 1)}</Text>
          </LinearGradient>
          <StarButton className="m-3" daoId={dao.id}/>
        </View>
        <View className="m-2">
            <Text className="text-2xl font-bold">{dao.name}</Text>
            <Text className="text-md font-light pt-1"> {metadata}</Text> 
        </View>
    </View>
    <View className="bg-gray-100 flex-1">
      { proposalsWithMetadata?.length && <FlatList
        data={proposalsWithMetadata}
        renderItem={({item}) => <ProposalCard proposal={item} navigation={navigation}/>}
        keyExtractor={(proposal) => proposal.id}
      />}
  </View>
    </SafeAreaView>
  )
}