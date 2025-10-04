import { ActivityIndicator } from 'react-native';
import React from 'react';
import { useTheme } from '@/hooks/theme/useTheme';
import { Colors } from '@/constants/Colors';

const Loader = ({
  size = 'small',
  color,
}: {
  size?: number | 'small' | 'large';
  color?: string;
}) => {
  const { mode } = useTheme();
  return (
    <ActivityIndicator size={size} color={color || Colors[mode].primary} />
  );
};

export default Loader;
