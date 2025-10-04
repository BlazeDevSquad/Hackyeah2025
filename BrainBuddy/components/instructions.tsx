import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../constants/styles';
import { useThemedStyles } from '../hooks/use-themed-styles';

export const Instructions = () => {
  const { colors } = useThemedStyles();

  return (
    <View style={styles.instructions}>
      <Text style={[styles.instructionText, { color: colors.subtext }]}>
        Maximum recording time: 60s
      </Text>
    </View>
  );
};
