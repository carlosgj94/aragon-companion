import { Button, View, Text, FlatList, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { request, gql } from 'graphql-request';
import { useEffect, useCallback, useState } from 'react';
import SearchBar from "react-native-dynamic-search-bar";
import axios from 'axios';

const searchQuery= gql`
   query daos ($limit:Int!, $skip: Int!, $direction: OrderDirection!, $search: String) {
    daos(first: $limit, skip: $skip, where: {name_contains_nocase: $search}){
      id
      name
      metadata
      proposals(first: $limit) {
        id
      }
     }
    }
`


const query = gql`
   query daos ($limit:Int!, $skip: Int!, $direction: OrderDirection!, $orderItem: Dao_orderBy) {
    daos(first: $limit, skip: $skip, orderDirection: $direction, orderBy: $orderItem){
      id
      name
      metadata
      proposals(first: $limit) {
        id
      }
     }
    }
`

type Proposal = {
  id: string;
}

type DAO = {
  id: string;
  metadata: string;
  name: string;
  token: string;
  proposals: Proposal[];
};

type Metadata = {
  description: string;
}

export default function HomeView({navigation}: any) {
  const [lastDAOs, setLastDAOs] = useState<DAO[]>();
  const [searchInput, setSearchInput] = useState<string>();
  
  const searchDAOList = useCallback(() => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      searchQuery,
      {limit: 10, skip: 0, direction: 'desc', search: searchInput}
    ).then((data) => {
      setLastDAOs(data['daos'])
    })
  }, [searchInput])

  const daoList = useCallback(() => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      query,
      {limit: 30, skip: 0, direction: 'desc', sortBy: 'createdAt'}
    ).then((data) => {
      setLastDAOs(data['daos'])
    })

  }, [lastDAOs]);

  useEffect(() => {
    if (!searchInput) daoList();
    else searchDAOList()
  }, [searchInput]);
  
  return (
    <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>
      <SearchBar
        className="m-3"
        placeholder="Search here"
        onChangeText={(text) => setSearchInput(text)}
      />
      { lastDAOs?.length && <FlatList
        data={lastDAOs}
        renderItem={({item}) => <DAOCard dao={item} navigation={navigation}/>}
        keyExtractor={dao => dao.id}
      />
      }
    </SafeAreaView>
  )
}

const DAOCard = ({dao, navigation}: any) => {
  const [description, setDescription] = useState<Metadata>();

  useEffect(() => {
    axios.get('https://api.ipfsbrowser.com/ipfs/get.php?hash='+dao.metadata)
      .then(({data}) => {
        console.log(data.description)
        setDescription(data.description)
      })
    .catch((error) => console.log('Axios error: ', error))
  }, [])
  
  const daoClicked = () => {
    navigation.push('DiscoverDAO', {dao, metadata: description})
  }

  return (
    <TouchableWithoutFeedback
      onPress={daoClicked}>
      <View className="block m-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <Text className="text-md text-xl">{dao.name}</Text>
        <Text>{description}</Text> 
        {dao.proposals.length > 0 && (<Text className="text-xxl bg-blue-500	color-blue-500">O</Text>)}
      </View>
    </TouchableWithoutFeedback>
    )
 }
