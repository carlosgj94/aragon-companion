import {View, Text} from 'react-native';

export default function ProposalView({navigation, route}: any) {
  const { proposal } = route.params;
  
  return (
      <View className="flex-1 bg-white">
        <Text className="text-md text-lg font-bold">{proposal.title}</Text>
        <Text className="font-light">{proposal.summary}</Text>
        <Text>Executed: {proposal.executed.toString()}</Text>
        <Text>Yes: {proposal.yes}</Text>
        <Text>No: {proposal.no}</Text>
        <Text>Abstain: {proposal.abstain}</Text>
        <Text>Open: {proposal.open.toString()}</Text>
    </View>
  );
}