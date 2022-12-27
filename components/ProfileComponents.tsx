import { View, Image, Text, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const AvatarImage = ({avatar}) => (
  <View className="flex justify-center items-center">
    {avatar 
      ? (<Image className="w-24 h-24 rounded-full" source={{uri: avatar}} />)
      : ( <LinearGradient 
            colors={['rgb(59,130,246)', 'rgb(255,255,255)']}
            className="m-1 p-1 rounded-full rotate-45">
          <Text className="w-7 h-7 text-center font-bold text-lg">🦅</Text>
        </LinearGradient> )
    }
  </View>
)

export const AddressComponent = ({address, name}) => (
  <View className="flex">
    { name 
      ? <Text className="text-center text-2xl font-extrabold m-2">{name}</Text>
      : <Text>{address.substring(6)}...{address.substring(address.length - 4)}</Text>
    }
  </View>
)

export const ConnectAccountComponent = ({connector}) => {
  return (
    <View className="flex-1 items-center content-center text-center align-middle place-items-center justify-center">
       <Text>Connect your account:</Text>
       <Button className="bg-black" title="Connect" onPress={() => connector?.connect()} />
    </View>
  )
}
