import { Platform, View, StyleSheet, Alert } from 'react-native';
import React from 'react';
import { useTheme } from '@/hooks/theme/useTheme';
import {
  ANIMATION_DURATION,
  MARGIN,
  INPUT_HEIGHT,
  BORDER_RADIUS,
  FONT_SIZE,
  ICON_SIZE,
  PADDING,
} from '@/constants/AppConstants';
import { ThemedView } from '@/components/common/view';
import { Colors } from '@/constants/Colors';
import Skeleton from '@/components/common/skeleton';
import * as ContextMenu from 'zeego/context-menu';
import { ThemedText } from '@/components/common/typography';
import { Message } from '@/utils/types';
import { Image } from 'expo-image';

import MarkdownComponent from '@/components/common/markdown';
import * as Clipboard from 'expo-clipboard';

const Bubble = ({ item }: { item: Message }) => {
  const { mode } = useTheme();
  if (item.isLoading) {
    return (
      <ThemedView style={styles.skeletonView}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            width="90%"
            height={INPUT_HEIGHT.xxs}
            key={index}
            startDelay={index * 100}
            borderRadius={BORDER_RADIUS.xxs}
            style={{ marginTop: MARGIN.lg }}
            duration={ANIMATION_DURATION.D15}
            backgroundColor={Colors[mode].backgroundOpacity}
            gradientColors={[
              Colors[mode].backgroundOpacity,
              Colors[mode].primary,
              Colors[mode].backgroundOpacity,
            ]}
          />
        ))}
      </ThemedView>
    );
  }

  return (
    <View
      style={
        !item.isUser
          ? {
              flexDirection: 'row',
              alignItems: 'flex-end',
            }
          : {}
      }
    >
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <ThemedView
            style={[
              styles.messageBubble,
              item.isUser ? styles.userBubble : styles.aiBubble,
              {
                backgroundColor: item.isUser
                  ? Colors[mode].button
                  : 'transparent',
              },
            ]}
          >
            {!item.isUser ? (
              <View style={styles.brandContainer}>
                <ThemedView>
                  <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.brandImage}
                    contentFit="contain"
                    transition={600}
                  />
                </ThemedView>
                <ThemedText style={styles.brandText}>
                  Ship Mobile Fast
                </ThemedText>
              </View>
            ) : null}
            <MarkdownComponent>{item.text}</MarkdownComponent>
          </ThemedView>
        </ContextMenu.Trigger>

        <ContextMenu.Content>
          <ContextMenu.Item
            key="copy"
            onSelect={async () => {
              await Clipboard.setStringAsync(item.text);
              Alert.alert('Copied to clipboard');
            }}
          >
            <ContextMenu.ItemTitle>
              {item.isUser ? 'Copy Message' : 'Copy Response'}
            </ContextMenu.ItemTitle>
          </ContextMenu.Item>

          {Platform.OS === 'ios' && (
            <ContextMenu.Preview>
              <View style={styles.previewContainer}>
                <ThemedText>{item.text}</ThemedText>
              </View>
            </ContextMenu.Preview>
          )}
        </ContextMenu.Content>
      </ContextMenu.Root>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    paddingHorizontal: PADDING.sm,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: PADDING.xs,
    marginTop: MARGIN.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: BORDER_RADIUS.xxs,
    minWidth: '12%',
    maxWidth: '75%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: BORDER_RADIUS.xxs,
    minWidth: '12%',
    maxWidth: '98%',
  },
  previewContainer: {
    padding: PADDING.sm,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: MARGIN.md,
    zIndex: 1000,
  },
  imageViewer: {
    width: ICON_SIZE.xs,
    height: ICON_SIZE.xs,
    borderRadius: BORDER_RADIUS.rounded,
    backgroundColor: Colors.light.error,
  },
  brandImage: {
    width: ICON_SIZE.xs,
    height: ICON_SIZE.xs,
  },
  brandText: {
    fontSize: FONT_SIZE.sm,
  },
  // Skeleton View
  skeletonView: {
    marginTop: MARGIN.xl,
  },
});

export default Bubble;
