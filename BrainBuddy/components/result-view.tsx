import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemedStyles } from '../hooks/use-themed-styles';
import { styles } from '../styles';

type Props = {
  transcript: string;
  onReset: () => void;
};

export const ResultView = ({ transcript, onReset }: Props) => {
  const { colors } = useThemedStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.resultContainer}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>
          Transcription
        </Text>
        <View style={[styles.resultBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.resultText, { color: colors.text }]}>
            {transcript || 'No speech was detected. Please try again.'}
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
