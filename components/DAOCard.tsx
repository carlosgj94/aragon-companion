import {useState, useEffect} from 'react';
import axios from 'axios';
import { TouchableWithoutFeedback, View, Text} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
const IPFS_URL = Constants?.manifest?.extra?.ipfsURL;

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
      axios.get(IPFS_URL+metadataURI)
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
      <View className="block m-2 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
        <View className="flex-row items-center">
          <LinearGradient 
              colors={['rgb(59,130,246)', 'rgb(255,255,255)']}
              className="m-1 p-1 rounded-full rotate-45">
            <Text className="w-7 h-7 text-center font-bold text-lg">{dao.name.substring(0, 1)}</Text>
          </LinearGradient>
          <Text className="text-xl font-bold">{dao.name}</Text>
        </View>
        <View className="flex-row justify-between pt-2">
          <Text className="font-light flex-1"> 
            {description?.length > 100 ? description.substring(0, 99)+'...' : description}
          </Text> 
          <View className="flex-row items-center">
            <Ionicons name="megaphone-outline" size={18} color="black" />
            <Text className="font-lg font-light p-1">{dao.proposals.length}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
    )
 }
