import React from 'react';
import { Stack } from 'expo-router';
import HeaderClose from '@/components/navigation/header/header-close';
import PaywallHeader from '@/components/navigation/header/paywall-header';
import { Colors } from '@/constants/Colors';

const ModalsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="paywall-double"
        options={{
          title: '',
          headerTitleAlign: 'center',
          headerRight: PaywallHeader,
          headerShadowVisible: false,
          headerBackVisible: false,
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="paywall-single"
        options={{
          title: '',
          headerRight: PaywallHeader,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="share-modal"
        options={{
          title: 'Share',
          headerLeft: () => <HeaderClose />,
        }}
      />
      <Stack.Screen
        name="image-view"
        options={{
          headerTitle: '',
          headerLeft: () => <HeaderClose />,
          presentation: 'formSheet',
          headerTransparent: true,
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="camera-view"
        options={{
          headerTransparent: true,
          headerTitle: '',
          presentation: 'formSheet',
          headerLeft: () => <HeaderClose color={Colors.light.white} />,
        }}
      />
    </Stack>
  );
};

export default ModalsLayout;
