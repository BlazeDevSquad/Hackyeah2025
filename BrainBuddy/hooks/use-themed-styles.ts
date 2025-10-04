import { useColorScheme } from 'react-native';

export const useThemedStyles = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: {
      background: isDark ? '#0f172a' : '#f8fafc',
      text: isDark ? '#e2e8f0' : '#1e293b',
      subtext: isDark ? '#94a3b8' : '#64748b',
      primary: isDark ? '#ffffff' : '#000000',
      primaryOpposite: isDark ? '#000000' : '#ffffff',
      card: isDark ? '#1e293b' : '#ffffff',
      border: isDark ? '#334155' : '#e2e8f0',
    },
  };
};
