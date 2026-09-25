import { Text, View } from 'react-native';

// Demo placeholder: the tab press is intercepted in (tabs)/_layout.tsx and shows a popup.
// This screen only renders if someone visits /messages directly.
export default function MessagesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text>Messages aren&apos;t available in the demo.</Text>
    </View>
  );
}
