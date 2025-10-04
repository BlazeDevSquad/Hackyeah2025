import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../constants/styles';
import { useThemedStyles } from '../hooks/use-themed-styles';

type Props = {
  isRecording: boolean;
};

export const Header = ({ isRecording }: Props) => {
  const { colors } = useThemedStyles();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>BrainBuddy</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        {isRecording ? 'Tap again to stop...' : 'Tap to start...'}
      </Text>
    </View>
  );
};
