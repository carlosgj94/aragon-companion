import { Button, View, Text, FlatList, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { request } from 'graphql-request';
import { useEffect, useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DAOCard from './DAOCard';
import { HomeDAOs } from '../queries'
import { DAO } from '../types';

export default function HomeView({navigation}: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastDAOs, setLastDAOs] = useState<DAO[]>();

  const getStorageStars = useCallback(async () => {
    var result = []
    try {
      const stored = await AsyncStorage.getItem(`starred`)
      if (stored !== null) result = JSON.parse(stored);
    } catch (e) {
      console.log(e);
    } finally {
      return result;
    }
  }, [])

  const daoList = useCallback(async () => {
    const starred = await getStorageStars()
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      HomeDAOs,
      {limit: 30, skip: 0, direction: 'desc', daos: starred}
    ).then((data) => {
      if (loading) setLastDAOs(data['daos'])
      setLoading(false);
    })

  }, [lastDAOs]);

  useEffect(() => {
    //if (!lastDAOs)
    if (loading) daoList();
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      daoList();
    });
    return () => { setLoading(false) }
  }, [navigation]);
  
  return (
    <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>
      { loading && <ActivityIndicator size="large"/> }
      { lastDAOs?.length > 0 
        ? <FlatList
            data={lastDAOs}
            renderItem={({item}) => <DAOCard dao={item} navigation={navigation}/>}
            keyExtractor={dao => dao.id}
          />
        : <NoFavs/>
      }
    </SafeAreaView>
  )
}

const NoFavs = () => {
  return (
    <View className="flex-1 items-center text-center">
      <Text className="text-5xl p-2">🦅</Text>
      <Text className="text-xl color-blue-500">No favs found</Text>
      <Text>Head to the Discover page and fav some DAOs.</Text>
    </View>
  )
}

