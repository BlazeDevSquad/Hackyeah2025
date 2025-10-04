import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThemedView } from '@/components/common/view';
import { setThemeMode, ThemeMode } from '@/store/slices/themeSlice';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import { FLEX, ICON_SIZE, MARGIN, PADDING } from '@/constants/AppConstants';
import RadioButton from '@/components/common/buttons/radio-button';
import { Ionicons } from '@expo/vector-icons';

interface Theme {
  key: ThemeMode;
  icon: 'sunny-outline' | 'moon-outline' | 'phone-portrait-outline';
  title: string;
}

const themes: Theme[] = [
  {
    key: 'light',
    title: 'Light',
    icon: 'sunny-outline',
  },
  {
    key: 'dark',
    title: 'Dark',
    icon: 'moon-outline',
  },
  {
    key: 'system',
    title: 'System',
    icon: 'phone-portrait-outline',
  },
];

const ThemeSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedMode, mode } = useTheme();

  return (
    <ThemedView style={styles.container}>
      {themes.map((theme) => (
        <RadioButton
          key={theme.key}
          icon={
            <Ionicons
              name={theme.icon}
              size={ICON_SIZE.sm}
              color={
                selectedMode === theme.key
                  ? Colors[mode].primary
                  : Colors[mode].text
              }
            />
          }
          label={theme.title}
          selected={selectedMode === theme.key}
          onSelect={() => dispatch(setThemeMode(theme.key))}
          color={Colors[mode].primary}
          style={styles.themeItem}
          height={130}
        />
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.one,
    padding: PADDING.sm,
    flexDirection: 'row',
  },
  themeItem: {
    marginBottom: MARGIN.md,
    flex: FLEX.one,
    margin: MARGIN.md,
    flexDirection: 'column-reverse',

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeSettings;
