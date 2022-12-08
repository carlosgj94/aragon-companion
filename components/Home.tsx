import { Button, View, Text, FlatList } from 'react-native';
import { request, gql } from 'graphql-request';
import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';

const query = gql`
   query daos ($limit:Int!, $skip: Int!, $direction: OrderDirection!, $sortBy: Dao_orderBy!) {
    daos(first: $limit, skip: $skip, orderDirection: $direction, orderBy: $sortBy){
      id
      name
      metadata
     }
  }
`

type DAO = {
  id: string;
  metadata: string;
  name: string;
};

export default function HomeView() {
  const [lastDAOs, setLastDAOs] = useState<DAO[]>();

  const daoList = useCallback(() => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      query,
      {limit: 10, skip: 15, direction: 'desc', sortBy: 'createdAt'}
    ).then((data) => {
      //console.log(data)
      setLastDAOs(data['daos'])
    })

  }, []);

  useEffect(() => {
    daoList();
  }, []);
  
  return (
    <View className="bg-white">
      { lastDAOs?.length && <FlatList
        data={lastDAOs}
        renderItem={({item}) => <DAOCard dao={item}/>}
        keyExtractor={dao => dao.id}
      />
      }
    </View>
  )
}

const DAOCard = ({dao}: any) => {
  const [description, setDescription] = useState('');
  useEffect(() => {
    axios.get('https://api.ipfsbrowser.com/ipfs/get.php?hash='+dao.metadata)
      .then(({data}) => {
        console.log('Metadata Response', data)
        setDescription(data.description)
      })
    .catch((error) => console.log('Axios error: ', error))
  }, [])

    return (
      <View className="block m-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <Text className="text-md text-xl">{dao.name}</Text>
        <Text> {description}</Text> 
      </View>
    )
 }
