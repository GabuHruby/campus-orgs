import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// Placeholder: real event detail in Step 6.
export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Event: {id}</Text>
    </View>
  );
}
