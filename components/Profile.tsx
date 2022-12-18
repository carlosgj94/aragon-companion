import {View, Button, TouchableWithoutFeedback, Text} from 'react-native'
import { useAccount, useBalance, useDisconnect, useEnsName, useEnsAvatar, useProvider, chain } from 'wagmi'
import {useCallback, useEffect, useState} from 'react'


const ProfileHeader = ({address}) => {
  const { data: avatar, isError: isErrorAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({ address, chainId: 1})
  const { data: name, isError: isErrorName, isLoading: isLoadingName, isSuccess } = useEnsName({ 
    address, 
    chainId: 1,
  })
  
  return (
    <View>
      <Text>{address}</Text>
      <Text>{name}</Text>
      <Text>{avatar?.toString()}</Text>
    </View>    
  )
}

export default function ProfileView({connector, account})  {
  
  if (!account?.address)
   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>Connect your account:</Text>
         <Button className="bg-black" title="Connect" onPress={() => connector?.connect()} />
      </View>
    )
  else return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      { account?.address && <ProfileHeader  address={account?.address}/>}
    </View>
  )
}