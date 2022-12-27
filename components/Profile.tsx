import {View, Button, TouchableWithoutFeedback, Text, Image} from 'react-native'
import { useAccount, useBalance, useDisconnect, useEnsName, useEnsAvatar, useProvider, chain } from 'wagmi'
import {useCallback, useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {AvatarImage, ConnectAccountComponent, AddressComponent} from './ProfileComponents';


const ProfileHeader = ({address}) => {
  const provider = useProvider()
  const [name, setName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
   
  const getEnsValues = useCallback(async () => {
    const ens = await provider.lookupAddress(address)
    const avatar = await provider.getAvatar(address)
    console.log(avatar)
    setName(ens!)
    setAvatar(avatar!)
    setLoading(false)
  }, [])

  useEffect(() => {
    getEnsValues()
  }, [])
  
  return (
    <View className="flex">
      <AvatarImage avatar={avatar} />
      <AddressComponent address={address} name={name} />
    </View>    
  )
}


export default function ProfileView({connector})  {
  const { data: account } = useAccount()

  return (
    <SafeAreaView className="bg-white flex-1" edges={['top', 'left', 'right']}>
      { account?.address && (
        <View className="flex-row justify-end">
          <Button title="Disconnect" onPress={() => connector?.killSession()} />
        </View>
      )}
      {!account?.address && <ConnectAccountComponent connector={connector}/> }
      { account?.address && <ProfileHeader  address={account?.address}/>}
    </SafeAreaView>
  )
}