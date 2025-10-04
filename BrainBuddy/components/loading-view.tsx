import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from '../constants/styles';
import { useThemedStyles } from '../hooks/use-themed-styles';

export const LoadingView = () => {
  const { colors } = useThemedStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.resultContainer}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>
          BrainBuddy is thinking...
        </Text>
        <View style={[styles.resultBox, { backgroundColor: colors.card, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.text} />
        </View>
      </View>
    </View>
  );
};
