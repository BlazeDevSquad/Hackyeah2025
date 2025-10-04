import { Stack } from 'expo-router';
import HeaderBack from '@/components/navigation/header/header-back';

const FeaturesStack = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: HeaderBack,
      }}
    >
      <Stack.Screen
        name="admob"
        options={{
          title: 'Admob',
        }}
      />
      <Stack.Screen
        name="replicate"
        options={{
          title: 'Replicate',
        }}
      />
      <Stack.Screen
        name="claude"
        options={{
          title: 'Claude',
        }}
      />
      <Stack.Screen
        name="chatgpt"
        options={{
          title: 'ChatGPT',
        }}
      />
      <Stack.Screen
        name="fal"
        options={{
          title: 'Fal AI',
        }}
      />
      <Stack.Screen
        name="identifier"
        options={{
          title: 'Identifier AI',
        }}
      />
    </Stack>
  );
};

export default FeaturesStack;
