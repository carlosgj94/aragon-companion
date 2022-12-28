import {View, Button, TouchableWithoutFeedback, Text, FlatList} from 'react-native'
import { useAccount, useBalance, useDisconnect, useEnsName, useEnsAvatar, useProvider, chain } from 'wagmi'
import {useCallback, useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { request } from 'graphql-request';
import {AvatarImage, ConnectAccountComponent, AddressComponent} from './ProfileComponents';
import {ProfileERC20VoteQuery} from '../queries';


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

const UserProposals = ({address}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [erc20Proposals, setErc20Proposals] = useState<any[]>();
  const [multiProposals, setMultiProposals] = useState<any[]>();

  const fetchErc20Votes = useCallback(async () => {
    console.log(address)
    request(
      'https://api.thegraph.com/subgraphs/name/aragon/aragon-zaragoza-goerli',
      ProfileERC20VoteQuery,
      {voter: address, limit: 10}
    ).then((data) => {
      if (loading) {
        console.log('Propsals: ', data)
        setErc20Proposals(data['erc20Votes'])
        setLoading(false);
      }
    }).catch((error) => console.log('error: ', error))
  }, [address])
  
  useEffect(() => {
    fetchErc20Votes();
  }, [])
  
  return (
    <View className="">
      {erc20Proposals?.length && <FlatList
        data={erc20Proposals}
        renderItem={({item}) => <ProposalWithDAO proposal={item} /> }
        keyExtractor={(proposal) => proposal.id}
      />
      }
    </View>
  )
}

const ProposalWithDAO = ({proposal}) => {
  return (
    <View className="block m-2 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      <Text>{proposal.proposal.metadata}</Text>
      <Text>{proposal.proposal.dao.name}</Text>
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
      { account?.address && <UserProposals address={account?.address}/>}
    </SafeAreaView>
  )
}