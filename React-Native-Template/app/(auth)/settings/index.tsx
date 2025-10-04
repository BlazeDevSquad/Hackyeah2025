import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/common/typography';
import { Href, useRouter } from 'expo-router';
import { ThemedView } from '@/components/common/view';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import PressableOpacity from '@/components/common/buttons/pressable-opacity';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '@/hooks/theme/useTheme';
import {
  BORDER_RADIUS,
  FLEX,
  FONT_SIZE,
  ICON_SIZE,
  MARGIN,
  PADDING,
} from '@/constants/AppConstants';
import { useAuth } from '@/context/FirebaseProvider';
import {
  LucideIcon,
  Languages,
  Sun,
  Lock,
  LogOut,
  Trash,
  LifeBuoy,
  Bell,
} from 'lucide-react-native';

const SettingsScreen = () => {
  const router = useRouter();
  const { mode } = useTheme();
  const { signOutHandler } = useAuth();

  const handleDeleteAccount = () => {
    router.push('/settings/delete-account');
  };

  const handlePrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync(
      'https://shipmobilefast.com/privacy-policy'
    );
  };

  const settings: {
    IconComponent: LucideIcon;
    title: string;
    onPress?: () => void;
    route?: Href;
  }[] = [
    {
      IconComponent: Languages,
      title: 'Language',
      route: '/settings/language',
    },
    {
      IconComponent: Sun,
      title: 'Theme',
      route: '/settings/theme',
    },
    {
      IconComponent: Lock,
      title: 'Privacy',
      onPress: handlePrivacyPolicy,
    },
    {
      IconComponent: LifeBuoy,
      title: 'Help',
      route: '/settings/help',
    },
    {
      IconComponent: Bell,
      title: 'Notifications',
      route: '/settings/notifications',
    },
  ];

  const SettingItem = ({
    IconComponent,
    title,
    onPress,
    color,
  }: {
    IconComponent: LucideIcon;
    title: string;
    onPress: () => void;
    color?: string;
  }) => (
    <PressableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <IconComponent size={ICON_SIZE.xs} color={Colors[mode].text} />
      </View>
      <ThemedText style={styles.settingText}>{title}</ThemedText>
      <Ionicons
        name="chevron-forward"
        size={ICON_SIZE.xs}
        color={Colors[mode].text}
        style={styles.chevron}
      />
    </PressableOpacity>
  );

  const SettingGroup = ({ children }: { children: React.ReactNode }) => (
    <ThemedView
      lightColor={Colors[mode].background}
      darkColor={Colors[mode].background}
      style={styles.settingGroup}
    >
      {children}
    </ThemedView>
  );

  return (
    <ThemedView
      lightColor={Colors.light.backgroundSecondary}
      darkColor={Colors.dark.backgroundSecondary}
      style={[styles.container]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SettingGroup>
          {settings.map((setting, index) => (
            <React.Fragment key={setting.title}>
              <SettingItem
                IconComponent={setting.IconComponent}
                title={setting.title}
                onPress={
                  setting.onPress
                    ? setting.onPress
                    : () => router.push(setting.route as Href)
                }
              />
              {index < settings.length - 1 && (
                <View
                  style={[
                    styles.separator,
                    { borderColor: Colors[mode].borderColor },
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </SettingGroup>

        <SettingGroup>
          <SettingItem
            IconComponent={LogOut}
            title="Logout"
            onPress={signOutHandler}
          />
          <View
            style={[
              styles.separator,
              { borderColor: Colors[mode].borderColor },
            ]}
          />
          <SettingItem
            IconComponent={Trash}
            title="Delete Account"
            onPress={handleDeleteAccount}
          />
        </SettingGroup>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.one,
  },
  iconContainer: {
    padding: PADDING.xs,
    borderRadius: BORDER_RADIUS.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingGroup: {
    marginTop: MARGIN.xl,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginHorizontal: MARGIN.xl,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PADDING.sm,
    paddingHorizontal: PADDING.sm,
  },

  settingText: {
    fontSize: FONT_SIZE.md,
    flex: FLEX.one,
    marginLeft: MARGIN.lg,
  },
  chevron: {
    opacity: 0.6,
  },
  separator: {
    left: PADDING.xxxl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default SettingsScreen;
