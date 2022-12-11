import {View, TouchableWithoutFeedback} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function StarButton({daoId}: any) {
  const [starred, setStarred] = useState<boolean>(false);
  
  const getStorageStars = useCallback(async () => {
    var result = []
    try {
      const stored = await AsyncStorage.getItem(`starred`)
      if (stored !== null) result = JSON.parse(stored);
    } catch (e) {
      console.log(e);
    } finally {
      return result;
    }
  }, [])
  
  const readStarState = useCallback(async () => {
    var star = false
    try {
      const stored = (await getStorageStars()).includes(daoId)
      setStarred(stored)
      star = stored
    } catch (e) {
      console.log(e);
    } finally {
      return star;
    }
  }, [])
  
  const setStarState = useCallback(async () => {
    try {
      // const currentStar = await readStarState()
      var currentStars = await getStorageStars()
      const index = currentStars.indexOf(daoId)
      if (index >= 0) {
        currentStars.splice(index, 1)
        await AsyncStorage.setItem('starred', JSON.stringify(currentStars))
        setStarred(false)
      } else {
        await AsyncStorage.setItem('starred', JSON.stringify([...currentStars, daoId]))
        setStarred(true)
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    readStarState()    
  }, [])
  
  const starPressed = () => {
    setStarState()
  }

  return (
    <TouchableWithoutFeedback
      onPress={starPressed}>
      <Ionicons name={starred ? 'star' : 'star-outline'} size={30} color={"black"} />
    </TouchableWithoutFeedback>
  )
}