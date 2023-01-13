import {useState, useEffect} from 'react';
import axios from 'axios';
import { TouchableWithoutFeedback, View, Text} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
const IPFS_URL = Constants?.manifest?.extra?.ipfsURL;
const IPFS_KEY = Constants?.manifest?.extra?.ipfsKey;
const requestConfig = {'headers': {'X-API-KEY': IPFS_KEY}}

type Metadata = {
  description: string;
}

export default function DAOCard({dao, navigation}: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const [description, setDescription] = useState<Metadata>();

  useEffect(() => {
    if (dao.metadata) {
      const metadataURI = dao.metadata
        .includes('ipfs://')
        ? dao.metadata.slice(7)
        : dao.metadata
      axios.post(IPFS_URL+metadataURI, {}, requestConfig)
        .then(({data}) => {
          if (loading) setDescription(data.description)
          setLoading(false)
        })
      .catch((error) => console.log('Axios error: ', error))
    }
    return () => { setLoading(false) }
  }, [])
  
  const daoClicked = () => {
    navigation.push('DAO', {dao, metadata: description})
  }

  return (
    <TouchableWithoutFeedback
      onPress={daoClicked}>
      <View className="block m-2 pl-4 pt-4 pr-4 bg-white border border-gray-200 rounded-lg shadow-md">
        <View className="flex-row items-center">
          <LinearGradient 
              colors={['rgb(59,130,246)', 'rgb(255,255,255)']}
              className="m-1 p-1 rounded-full rotate-45">
            <Text className="w-7 h-7 text-center font-bold text-lg">{dao.name.substring(0, 1)}</Text>
          </LinearGradient>
          <Text className="text-xl font-black color-gray-900">{dao.name.replace('_', ' ')}</Text>
        </View>
        <View className="flex-row justify-between pt-2">
          <Text className="font-light flex-1"> 
            {description?.length > 100 ? description.substring(0, 99)+'...' : description}
          </Text> 
        </View>
        <View className="flex-row justify-around p-1 m-3 bg-blue-50 border border-gray-200 rounded-xl">
          <View className="flex-row items-center">
            <Text className="font-lg font-light p-1">{dao.proposals.length}</Text>
            <Ionicons name="megaphone-outline" size={18} color="black" />
          </View>

          <View className="flex-row items-center">
            <Text className="font-lg font-light p-1">{
              dao.members ? dao.members.length : 0
            }</Text>
            <Ionicons name="person-outline" size={18} color="black" />
          </View>

          <View className="flex-row items-center">
            <Text className="font-lg font-light p-1">$0</Text>
            <Ionicons name="cash-outline" size={18} color="black" />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
    )
 }
