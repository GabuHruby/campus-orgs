import { Text, View } from 'react-native';

// Demo placeholder: the tab press is intercepted in (tabs)/_layout.tsx and shows a popup.
// This screen only renders if someone visits /profile directly.
export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text>Profiles aren&apos;t available in the demo.</Text>
    </View>
  );
}
