import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/common/typography';
import { FONT_SIZE, MARGIN } from '@/constants/AppConstants';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';

export const TermsText: React.FC<{ price: string }> = ({ price }) => {
  const { mode } = useTheme();
  return (
    <ThemedText
      type="default"
      style={[styles.termsText, { color: Colors[mode].text }]}
    >
      Paywall Info Footer Text
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  termsText: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginVertical: MARGIN.lg,
    marginHorizontal: MARGIN.xl,
  },
});
