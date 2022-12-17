import {View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BigNumber} from 'ethers';

const ProposalCard = ({proposal, navigation, plugin}: any) => {
  const proposalClicked = () => {
    navigation.push('Proposal', {proposal, navigation, plugin});
  }
  const census = BigNumber.from(proposal.census)
  const voteCount = proposal.voteCount ? BigNumber.from(proposal.voteCount) : BigNumber.from(0);
  const yesVotes = !voteCount.eq(0) && BigNumber.from(proposal.yes).mul(100).div(voteCount).toNumber();
  const abstainVotes = proposal.abstain && !voteCount.eq(0) && BigNumber.from(proposal.abstain).mul(100).div(voteCount).toNumber();
  const noVotes = !voteCount.eq(0) && BigNumber.from(proposal.no).mul(100).div(voteCount).toNumber();
  const censusPercentage = !census.eq(0) &&
     (!voteCount.eq(0) ? voteCount.mul(100).div(census).toNumber() : 0);
  
  const VoteDistributionBar = () => (
    <View className="flex-1 flex-row border rounded-md border-gray-300 shadow-md mt-2 mb-2">
      <View 
          className="bg-green-400 pt-3 pb-3 rounded-l-md" 
          style={{width: yesVotes+'%'}}
      />
      <View 
        className="bg-red-400 pt-3 pb-3"
          style={{width: noVotes+'%'}}
      />
      {proposal.abstain && <View 
        className="bg-gray-400 pt-3 pb-3 rounded-r-md"
        style={{width: abstainVotes+'%'}}
      />}
    </View>
  )

  return (
    <TouchableWithoutFeedback
      onPress={proposalClicked}>
      <View className="block m-2 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
        <View className="flex-row items-center">
          <Text className="text-md text-xl font-bold pl-1">{proposal.title}</Text>
        </View>

      <View className="flex-row">
        <View className="flex-1">
          {proposal.voteCount !== "0" && <VoteDistributionBar />}
          <View className="flex-row justify-between pt-3">
            <View>
            { proposal.open 
                ? (<Text>EndDate: {proposal.endDate}</Text>)
                : proposal.executed
                  ? (<Text className="color-green-500 font-bold">Executed</Text>)
                  : (<Text className="color-green-800 font-bold">To be executed</Text>)
            }
            </View>
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={18} color="black" />
              <Text>{censusPercentage}%</Text>
            </View>
          </View>
        </View>
      </View>

      </View>
    </TouchableWithoutFeedback>
  )
}

export default ProposalCard;
