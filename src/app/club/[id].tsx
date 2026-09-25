import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// Placeholder: real club page in Step 5.
export default function ClubScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Club: {id}</Text>
    </View>
  );
}
