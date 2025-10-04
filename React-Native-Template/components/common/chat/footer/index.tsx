import { StyleSheet } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/common/typography';
import { Message } from '@/hooks/useChat';
import { Colors } from '@/constants/Colors';
import { FONT_SIZE, MARGIN, PADDING } from '@/constants/AppConstants';
import { ThemedView } from '@/components/common/view';

const Footer = ({ messages }: { messages: Message[] }) => {
  if (
    messages.length > 0 &&
    !messages[messages.length - 1].isUser &&
    !messages[messages.length - 1].isLoading
  ) {
    return (
      <ThemedView style={styles.mistakeContainer}>
        <ThemedText
          lightColor={Colors.light.placeholderColor}
          darkColor={Colors.dark.placeholderColor}
          style={styles.mistakeText}
        >
          Ship Mobile Fast can make mistakes. Double check results.
        </ThemedText>
      </ThemedView>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  mistakeContainer: {
    marginTop: MARGIN.sm,
    paddingHorizontal: PADDING.sm,
  },
  mistakeText: {
    fontSize: FONT_SIZE.xs,
    fontStyle: 'italic',
  },
});

export default Footer;
