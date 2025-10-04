import React from 'react';
import { Stack } from 'expo-router';
import HeaderBack from '@/components/navigation/header/header-back';
import HeaderClose from '@/components/navigation/header/header-close';

const SettingsLayout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerLeft: HeaderBack,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Language',
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          title: 'Theme',
        }}
      />

      <Stack.Screen
        name="help"
        options={{
          title: 'Help',
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          title: 'Delete Account',
          animation: 'slide_from_bottom',
          headerLeft: () => <HeaderClose />,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
