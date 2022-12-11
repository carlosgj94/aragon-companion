import {View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import { request, gql } from 'graphql-request';
import { useState, useEffect, useCallback } from 'react';
import StarButton from './StarButton';
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

const fetchMultisigProposals = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      multisigQuery,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      console.log('Address Proposals: ', data['addresslistProposals'])
      setProposals(data['addresslistProposals'])
    })
  }, [])
  
  
  const fetchErc20Proposals = useCallback(async () => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      erc20Query,
      {limit: 10, dao: dao.id}
    ).then((data) => {
      console.log('ERC@) Proposals: ', data['erc20VotingProposals'])
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
    console.log(proposalsMetadata)
    setProposalsWithMetadata(proposalsMetadata)
  }, [proposals]);
  
  useEffect(() => {
    if (!proposals?.length) fetchErc20Proposals();
    if (proposals?.length) fetchProposalsMetadata();
  }, [proposals])

  return (
    <View className="bg-white flex-1">
      <View className="flex flex-row justify-between m-3">
        <Text className="text-md text-xxl font-bold">{dao.name}</Text>
        <StarButton daoId={dao.id}/>
      </View>
      <Text> {metadata}</Text> 
      { proposalsWithMetadata?.length && <FlatList
        data={proposalsWithMetadata}
        renderItem={({item}) => <ProposalCard proposal={item} navigation={navigation}/>}
        keyExtractor={(proposal) => proposal.id}
      />}
    </View>
  )
}