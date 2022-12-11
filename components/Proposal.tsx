import {View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BigNumber} from 'ethers';


const VoteBar = ({title, votes, color}) => {
  return (
    <View className="mt-4 mb-5">
      <View className="flex-row justify-between m-1 items-center">
        <Text className="color-blue-500 text-md font-bold">{title}</Text>
        <View className="flex-row items-center">
         <Ionicons name="person-outline" size="18" color="black" />
          <Text>{votes}%</Text>
        </View>
      </View>
      <View className="flex-1 bg-gray-200 pt-4 pb-4 pr-2 rounded-lg">
        <View 
          className={`p-3 m-1 rounded-lg justify-start absolute ${color}`}
          style={{width: votes+'%'}}
        ></View>
      </View>
    </View>
  )
}

export default function ProposalView({navigation, route}: any) {
  const { proposal } = route.params;

  const census = BigNumber.from(proposal.census)
  const voteCount = proposal.voteCount ? BigNumber.from(proposal.voteCount) : BigNumber.from(0);
  const yesVotes = !voteCount.eq(0) && BigNumber.from(proposal.yes).div(voteCount).mul(100).toNumber();
  const abstainVotes = proposal.abstain && !voteCount.eq(0) && BigNumber.from(proposal.abstain).div(voteCount).mul(100).toNumber();
  const noVotes = !voteCount.eq(0) && BigNumber.from(proposal.no).div(voteCount).mul(100).toNumber();
  const censusPercentage = !census.eq(0) &&
     (!voteCount.eq(0) ? voteCount.mul(100).div(census).toNumber() : 0);
  
  
  return (
      <View className="flex-1 bg-gray-100">
      <View className="p-2">
        <Text className="text-md mt-2 mb-1 text-2xl font-bold color-gray-900">{proposal.title}</Text>
        <View className="flex-row mb-2">
          <Text className="color-gray-500">Published by </Text>
          <Text className="color-blue-500">{proposal.creator.substring(0, 5)}...{proposal.creator.substring(38)}</Text>
        </View>
        <Text className="font-light text-md pt-1 mb-2">{proposal.summary}</Text>
    
        <View className="p-2 mt-2 bg-white border rounded-xl border-gray-200">
          <Text className="font-bold text-xl">Voters</Text>
          <View className="mt-1 mb-4">
            <VoteBar title="Yes" votes={yesVotes} color="bg-green-500"/>
            <VoteBar title="No" votes={noVotes} color="bg-red-500"/>
            <VoteBar title="Abstain" votes={abstainVotes} color="bg-gray-500"/>
          </View>
        </View>
      </View>
      <View className="flex-1"/>
      <View className="justify-end h-24 flex-row">
        <View className="bg-green-500 flex-1 border-r border-t-2 border-gray-100">
          <Text className="text-4xl italic font-bold color-white text-center pt-4">Yes</Text>
        </View>

        <View className="bg-red-500 flex-1 border-l border-t-2 border-gray-100">
          <Text className="text-4xl italic font-bold color-white text-center pt-4">No</Text>
        </View>
      </View>
    </View>
  );
}