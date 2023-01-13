import {View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BigNumber} from 'ethers';
import {Proposal, DAO, Plugin } from '../types';

type ProposalCardProps = {
  proposal: Proposal;
  navigation: any;
  plugin: Plugin;
  dao: DAO;
};

enum ProposalWinner {
  yes = 'Proposal passed',
  no = 'Proposal denied',
  abstain = 'Proposal abstained',
  nonQuorum = 'Quorum not achieved',
  minParticipation = 'Min participation not reached'
}


const ProposalCard = ({proposal, navigation, plugin, dao}: ProposalCardProps) => {
  const proposalClicked = () => {
    navigation.push('Proposal', {proposal, navigation, plugin, dao});
  }
  const census = BigNumber.from(proposal.census)
  const voteCount = proposal.voteCount ? BigNumber.from(proposal.voteCount) : BigNumber.from(0);
  const yesVotes = !voteCount.eq(0) && BigNumber.from(proposal.yes).mul(10000).div(voteCount).toNumber()/100;
  const abstainVotes = proposal.abstain && !voteCount.eq(0) && BigNumber.from(proposal.abstain).mul(10000).div(voteCount).toNumber()/100;
  const noVotes = !voteCount.eq(0) && BigNumber.from(proposal.no).mul(10000).div(voteCount).toNumber()/100;
  const censusPercentage = !census.eq(0) &&
     (!voteCount.eq(0) ? voteCount.mul(100).div(census).toNumber() : 0);

  const proposalWinner = () => {
    try {
      const yes = BigNumber.from(proposal.yes)
      const no = BigNumber.from(proposal.no)
      const abstain = BigNumber.from(proposal.abstain)
      const census = BigNumber.from(proposal.census)
      const voteCount = proposal.voteCount ? BigNumber.from(proposal.voteCount) : BigNumber.from(0);
    
      const minParticipation = BigNumber.from(plugin.totalSupportThresholdPct)
      const quorum = BigNumber.from(plugin.relativeSupportThresholdPct)

      if (minParticipation.gt(voteCount)) return ProposalWinner.minParticipation
      if (quorum.gt(yes) && quorum.gt(no) && quorum.gt(quorum)) return ProposalWinner.nonQuorum
  
      return (yes.gt(no) && yes.gt(abstain))
        ? ProposalWinner.yes 
        : (no.gt(yes) && no.gt(abstain)) 
          ? ProposalWinner.no
          : ProposalWinner.abstain
    } catch(err) {
      return ProposalWinner.minParticipation
    }
  }
  
  
  const VoteDistributionBar = () => (
    <View className="flex-1 flex-row border rounded-md bg-gray-200 border-gray-300 shadow-md mt-2 mb-2">
      <View 
          className="bg-green-400 pt-3 pb-3 rounded-md border border-green-500"
          style={{width: yesVotes+'%'}}
      />
      <View 
        className="bg-red-400 pt-3 pb-3 rounded-md border border-red-500"
          style={{width: noVotes+'%'}}
      />
      {(proposal.abstain && proposal.abstain !== '0') && <View 
        className="bg-gray-400 pt-3 pb-3 rounded-md border border-gray-500"
        style={{width: abstainVotes+'%'}}
      />}
    </View>
  )

  return (
    <TouchableWithoutFeedback
      onPress={proposalClicked}>
      <View className="block m-2 p-3 bg-white border border-gray-200 rounded-lg shadow-md">
        { proposal?.dao?.name && (
          <View className="flex-row justify-end">
            <Text className="color-blue-500 text-sm">{proposal.dao.name}</Text>
          </View>
        )}
        <View className="flex-row items-center">
          <Text className="text-md text-xl font-bold pl-1">{proposal.title}</Text>
        </View>
          <Text className="text-md text-md font-light pl-1">{proposal.summary}</Text>

      <View className="flex-row">
        <View className="flex-1">
          {!voteCount.eq(0) && <VoteDistributionBar />}
          <View className="flex-row justify-between pt-3">
            <View>
            { proposal.open 
                ? (<Text>EndDate: {proposal.endDate}</Text>)
                : proposal.executed
                  ? (<Text className="color-green-500 font-bold">Executed</Text>)
                  : (<Text className="color-green-800 font-bold">{proposalWinner()}</Text>)
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
