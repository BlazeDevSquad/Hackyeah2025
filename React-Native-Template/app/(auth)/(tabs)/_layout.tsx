import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import ProfileHeader from '@/components/navigation/header/profile-header';

const TabLayout = () => {
  const { mode } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors[mode].primary || Colors[mode].button,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Ship Mobile Fast',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name={'home'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerRight: ProfileHeader,
          tabBarIcon: ({ color }) => <TabBarIcon name={'user'} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
