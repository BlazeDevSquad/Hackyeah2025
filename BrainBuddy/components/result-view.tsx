import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../constants/styles';
import { useThemedStyles } from '../hooks/use-themed-styles';

type Props = {
  geminiResponse: string;
  onReset: () => void;
};

export const ResultView = ({ geminiResponse, onReset }: Props) => {
  const { colors } = useThemedStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.resultContainer}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>
          Here you go!
        </Text>
        <View style={[styles.resultBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.resultText, { color: colors.text }]}>
            {geminiResponse}
          </Text>
        </View>
        <Pressable onPress={onReset} style={[styles.backButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.backButtonText, { color: colors.primaryOpposite }]}>
            New Recording
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
