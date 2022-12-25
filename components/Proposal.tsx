import {View, Text, TouchableWithoutFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BigNumber} from 'ethers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useState, useEffect, useCallback} from 'react';
import * as Sharing from 'expo-sharing';


dayjs.extend(relativeTime)

enum ProposalStatus {
  ToBeStarted,
  Open,
  Finished
}

enum ProposalWinner {
  yes = 'Proposal passed',
  no = 'Proposal denied',
  abstain = 'Proposal abstained',
  nonQuorum = 'Quorum not achieved',
  minParticipation = 'Min participation not reached'
}

const BottomBar = ({proposal, proposalStatus, plugin}) => {
  const proposalWinner = () => {
    const yes = BigNumber.from(proposal.yes)
    const no = BigNumber.from(proposal.no)
    const abstain = BigNumber.from(proposal.no)
    const census = BigNumber.from(proposal.census)
    const voteCount = proposal.voteCount ? BigNumber.from(proposal.voteCount) : BigNumber.from(0);
    
    console.log('Plugin: ', plugin)
      const minParticipation = BigNumber.from(plugin.totalSupportThresholdPct)
      const quorum = BigNumber.from(plugin.relativeSupportThresholdPct)
    
      if (minParticipation.gt(voteCount)) return ProposalWinner.minParticipation
      if (quorum.gt(yes) && quorum.gt(no) && quorum.gt(quorum)) return ProposalWinner.nonQuorum
    
      return (yes.gt(no) && yes.gt(abstain))
        ? ProposalWinner.yes 
        : (no.gt(yes) && no.gt(abstain)) 
          ? ProposalWinner.no
          : ProposalWinner.abstain
  }

  if (proposalStatus !== ProposalStatus.Finished) return (
      <View className="justify-end h-24 flex-row">
        <View className={`${proposalStatus === ProposalStatus.Open ? 'bg-green-500' : 'bg-green-200'} flex-1 border-r border-t-2 border-gray-100`}>
          <Text className="text-4xl italic font-bold color-white text-center pt-4">Yes</Text>
        </View>

        <View className={`${proposalStatus === ProposalStatus.Open ? 'bg-red-500' : 'bg-red-200'} flex-1 border-l border-t-2 border-gray-100`}>
          <Text className="text-4xl italic font-bold color-white text-center pt-4">No</Text>
        </View>
      </View>
  )
  else return (
    <View className="justify-end h-24 flex-row">
      <View className={`${proposalWinner() === ProposalWinner.yes ? 'bg-green-300' : proposalWinner() === ProposalWinner.no ? 'bg-red-300' : 'bg-gray-300'} flex-1 border-r border-t-2 border-gray-100`}>
        <Text className="text-2xl italic font-bold color-white text-center pt-4">
           { proposalWinner().toString() }
        </Text>
      </View>
    </View>
  )
}

const VoteBar = ({title, votes, color}) => {
  return (
    <View className="mt-4 mb-5">
      <View className="flex-row justify-between m-1 items-center">
        <Text className="color-blue-500 text-md font-bold">{title}</Text>
        <View className="flex-row items-center">
         <Ionicons name="person-outline" size={18} color="black" />
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
  const { proposal, plugin, dao } = route.params;

  const census = BigNumber.from(proposal.census)
  const voteCount = proposal.voteCount ? BigNumber.from(proposal.voteCount) : BigNumber.from(0);
  const yesVotes = !voteCount.eq(0) && BigNumber.from(proposal.yes).mul(100).div(voteCount).toNumber();
  const abstainVotes = proposal.abstain && !voteCount.eq(0) && BigNumber.from(proposal.abstain).div(voteCount).mul(100).toNumber();
  const noVotes = !voteCount.eq(0) && BigNumber.from(proposal.no).mul(100).div(voteCount).toNumber();
  const censusPercentage = !census.eq(0) &&
     (!voteCount.eq(0) ? voteCount.mul(100).div(census).toNumber() : 0);
  
  const proposalStatus: ProposalStatus = dayjs().isBefore(dayjs(proposal.startDate * 1000))
    ? ProposalStatus.ToBeStarted
    : dayjs().isBefore(dayjs(proposal.endDate * 1000))
      ? ProposalStatus.Open
      : ProposalStatus.Finished

  https://zaragoza-staging.aragon.org/#/daos/goerli/0x0f24540527627f4c045a25f298446e4896d5ba28/governance/proposals/0x98a7428635602fc7024e700227dfb11fe0b29ab2_0x0
  return (
      <View className="flex-1 bg-gray-100">
      <View className="p-2">
        <View className="flex-row items-center">
          <Text className="text-md mt-2 mb-1 text-2xl font-bold color-gray-900">{proposal.title}</Text>
          <TouchableWithoutFeedback 
            className="justify-self-end"
            onPress={() => Sharing.shareAsync('https://zaragoza-staging.aragon.org/#/daos/goerli/'+dao.id+'governance/proposals/'+proposal.id)}>
            <Ionicons className="m-3 w-50" name="share-outline" size={28} color={"black"} />
          </TouchableWithoutFeedback>
        </View>
        <View className="flex-row mb-2">
          <Text className="color-gray-500">Published by </Text>
          <Text className="color-blue-500">{proposal.creator.substring(0, 5)}...{proposal.creator.substring(38)}</Text>
        </View>
        <Text className="font-light text-md pt-1 mb-2">{proposal.summary}</Text>
        <View className="flex-row justify-between items-center">
          <Text>Participation: {censusPercentage}%</Text>
          { proposalStatus === ProposalStatus.ToBeStarted
            ?   (<Text>Starts in: {dayjs(proposal.startDate * 1000).fromNow()}</Text>)
            : proposalStatus === ProposalStatus.Open 
              ? (<Text className="color-green-500 font-bold text-lg">Open</Text>)
              : (<Text>Finished</Text>)
          }
        </View>
    
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
      <BottomBar proposal={proposal} proposalStatus={proposalStatus} plugin={plugin}/>
    </View>
  );
}