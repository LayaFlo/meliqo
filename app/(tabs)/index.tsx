import * as React from 'react';
import { Button, PaperProvider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="headlineMedium">Hello world!</Text>
        <Button mode="contained" style={{ marginTop: 20 }}>
          Some button
        </Button>
      </SafeAreaView>
    </PaperProvider>
  );
} 
 