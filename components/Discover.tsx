import { Button, View, Text, FlatList, TouchableWithoutFeedback } from 'react-native';
import { request, gql } from 'graphql-request';
import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';

const query = gql`
   query daos ($limit:Int!, $skip: Int!, $direction: OrderDirection!, $sortBy: Dao_orderBy!) {
    daos(first: $limit, skip: $skip){
      id
      name
      metadata
      token
      proposals(first: $limit) {
        id
        creator
        metadata
        executed
        createdAt
      }
     }
    }
`

type Proposal = {
  id: string;
  creator: string;
  metadata: string;
  executed: boolean;
  createdAt: string;
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

  const daoList = useCallback(() => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      query,
      {limit: 30, skip: 0, direction: 'desc', sortBy: 'createdAt'}
    ).then((data) => {
//      console.log('DAOs: ', data['daos'])
      setLastDAOs(data['daos'])
    })

  }, [lastDAOs]);

  useEffect(() => {
    daoList();
  }, []);
  
  return (
    <View className="bg-white">
      { lastDAOs?.length && <FlatList
        data={lastDAOs}
        renderItem={({item}) => <DAOCard dao={item} navigation={navigation}/>}
        keyExtractor={dao => dao.id}
      />
      }
    </View>
  )
}

const DAOCard = ({dao, navigation}: any) => {
  const [description, setDescription] = useState<Metadata>();
  useEffect(() => {
    axios.get('https://api.ipfsbrowser.com/ipfs/get.php?hash='+dao.metadata)
      .then(({data}) => {
        // console.log('Metadata Response: ', data)
        setDescription(data.description)
      })
    .catch((error) => console.log('Axios error: ', error))
  }, [])
  
  const daoClicked = () => {
    navigation.push('DAO', {dao, metadata: description})
  }

  return (
    <TouchableWithoutFeedback
      onPress={daoClicked}>
      <View className="block m-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <Text className="text-md text-xl">{dao.name}</Text>
        <Text> {description}</Text> 
        {dao.proposals.length > 0 && (<Text className="text-xxl bg-blue-500	color-blue-500">O</Text>)}
      </View>
    </TouchableWithoutFeedback>
    )
 }
