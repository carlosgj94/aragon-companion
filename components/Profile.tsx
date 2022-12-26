import {View, Button, TouchableWithoutFeedback, Text, Image} from 'react-native'
import { useAccount, useBalance, useDisconnect, useEnsName, useEnsAvatar, useProvider, chain } from 'wagmi'
import {useCallback, useEffect, useState} from 'react'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import ethers from 'ethers';


const ProfileHeader = ({address}) => {
  const provider = useProvider()
  const [name, setName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  
  const getEnsValues = useCallback(async () => {
    // const address = provider.getAddress()
    const ens = await provider.lookupAddress(address)
    const avatar = await provider.getAvatar(address)
    setName(ens!)
    setAvatar(avatar!)
  }, [])

  useEffect(() => {
    getEnsValues()
  }, [])
  
  return (
    <View>
      { avatar && <Image
          style={{width: '100%', height: '50%'}}
         source={{uri: avatar}} />}
      <Text>{address}</Text>
      { name && <Text>{name}</Text>}
      { avatar && <Text>{avatar}</Text>}
    </View>    
  )
}

export default function ProfileView({connector})  {
  const { data: account } = useAccount()

  if (!account?.address)
   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>Connect your account:</Text>
         <Button className="bg-black" title="Connect" onPress={() => connector?.connect()} />
        <Button title="Disconnect" onPress={() => connector?.killSession()} />
      </View>
    )
  else return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Disconnect" onPress={() => connector?.killSession()} />
      { account?.address && <ProfileHeader  address={account?.address}/>}
    </View>
  )
}