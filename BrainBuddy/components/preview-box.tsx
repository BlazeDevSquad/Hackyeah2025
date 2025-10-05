import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../constants/styles';
import { useThemedStyles } from '../hooks/use-themed-styles';

type Props = {
  transcript: string;
  partialTranscript: string;
};

export const PreviewBox = ({ transcript, partialTranscript }: Props) => {
  const { colors } = useThemedStyles();

  if (!transcript && !partialTranscript) {
    return null;
  }

  return (
    <View
      style={[
        styles.previewBox,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.previewText, { color: colors.text }]}>
        {transcript}
        {partialTranscript ? (
          <Text style={{ color: colors.subtext }}> {partialTranscript}</Text>
        ) : null}
      </Text>
    </View>
  );
};
