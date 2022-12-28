import { Button, View, Text, FlatList, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { request, gql } from 'graphql-request';
import { useEffect, useCallback, useState } from 'react';
import SearchBar from "react-native-dynamic-search-bar";
import DAOCard from './DAOCard';
import { SearchDiscoverQuery, DiscoverQuery } from '../queries'
import {DAO} from '../types';


export default function HomeView({navigation}: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastDAOs, setLastDAOs] = useState<DAO[]>();
  const [searchInput, setSearchInput] = useState<string>();
  
  const searchDAOList = useCallback(() => {
    setLoading(true);
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      SearchDiscoverQuery,
      {limit: 10, skip: 0, direction: 'desc', search: searchInput}
    ).then((data) => {
      const daos = data['daos'].map(dao => {
        let members = []
        if (dao.plugins[0].plugin.members?.length)
          members = dao.plugins[0].plugin.members?.flatMap(item => item.address)
        return {
          members, 
          ...dao
        }
      })
      if (loading) setLastDAOs(daos)
      setLoading(false);
    })
  }, [searchInput])

  const daoList = useCallback(() => {
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      DiscoverQuery,
      {limit: 30, skip: 0, direction: 'desc', sortBy: 'createdAt'}
    ).then((data) => {
      const daos = data['daos'].map(dao => {
        let members = []
        if (dao.plugins[0].plugin.members?.length)
          members = dao.plugins[0].plugin.members?.flatMap(item => item.address)
        return {
          members, 
          ...dao
        }
      })
      if (loading) setLastDAOs(daos);
      setLoading(false);
    })

  }, [lastDAOs]);

  useEffect(() => {
    if (!searchInput) daoList();
    else searchDAOList()

    return () => { setLoading(false) }
  }, [searchInput]);
  
  return (
    <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>
      <SearchBar
        className="m-3"
        placeholder="Search here"
        onChangeText={(text) => setSearchInput(text)}
      />
      { loading && <ActivityIndicator size="large"/> }
      { lastDAOs?.length && <FlatList
        data={lastDAOs}
        renderItem={({item}) => <DAOCard dao={item} navigation={navigation}/>}
        keyExtractor={dao => dao.id}
      />
      }
    </SafeAreaView>
  )
}
