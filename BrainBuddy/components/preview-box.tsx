import React from 'react';
import { Text, View } from 'react-native';
import { useThemedStyles } from '../hooks/use-themed-styles';
import { styles } from '../styles';

type Props = {
  transcript: string;
  partialTranscript: string;
};

export const PreviewBox = ({ transcript, partialTranscript }: Props) => {
  const { colors } = useThemedStyles();

  // Don't render the component if there is no text to show
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
        {/* Render partial transcript in a different color */}
        {partialTranscript ? (
          <Text style={{ color: colors.subtext }}> {partialTranscript}</Text>
        ) : null}
      </Text>
    </View>
  );
};
