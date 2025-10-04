import { Platform } from 'react-native';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@/hooks/theme/useTheme';
import { Colors } from '@/constants/Colors';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  FLEX,
  FONT_SIZE,
  MARGIN,
} from '@/constants/AppConstants';
import { PADDING } from '@/constants/AppConstants';

const MarkdownComponent = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();

  return (
    <Markdown
      style={{
        body: {
          color: Colors[mode].text,
        },
        heading1: {
          color: Colors[mode].primary,
          fontSize: FONT_SIZE.xl,
          fontWeight: 'bold',
          marginTop: MARGIN.lg,
        },
        heading2: {
          color: Colors[mode].primary,
          fontSize: FONT_SIZE.lg,
          fontWeight: 'bold',
          fontStyle: 'italic',
          marginTop: MARGIN.lg,
        },
        heading3: {
          color: Colors[mode].primary,
          fontWeight: 'bold',
          fontSize: FONT_SIZE.md,
          marginTop: MARGIN.lg,
          fontStyle: 'italic',
        },
        list_item: {
          marginVertical: MARGIN.lg,
          fontSize: FONT_SIZE.md,
        },
        // Code
        code_inline: {
          borderRadius: BORDER_RADIUS.lg,
          backgroundColor: Colors[mode].borderColor,
          padding: PADDING.xs,
          ...Platform.select({
            ['ios']: {
              fontFamily: 'Courier',
            },
            ['android']: {
              fontFamily: 'monospace',
            },
          }),
        },
        fence: {
          borderWidth: BORDER_WIDTH.xs,
          borderColor: Colors[mode].borderColor,
          backgroundColor: Colors[mode].backgroundSecondary,
          padding: PADDING.md,
          borderRadius: BORDER_RADIUS.xs,
          marginVertical: MARGIN.md,
          ...Platform.select({
            ['ios']: {
              fontFamily: 'Courier',
            },
            ['android']: {
              fontFamily: 'monospace',
            },
          }),
        },
        // Tables
        table: {
          overflow: 'hidden',
          borderWidth: BORDER_WIDTH.xs,
          borderColor: Colors[mode].borderColor,
          borderRadius: BORDER_RADIUS.xs,
        },
        thead: {
          backgroundColor: Colors[mode].backgroundSecondary,
        },
        tbody: {},
        th: {
          flex: FLEX.one,
          backgroundColor: Colors[mode].backgroundSecondary,
        },
        tr: {
          borderBottomWidth: BORDER_WIDTH.xs,
          borderColor: Colors[mode].borderColor,
          flexDirection: 'row',
        },
        td: {
          flex: FLEX.one,
          padding: PADDING.xs,
        },

        // Links
        link: {
          textDecorationLine: 'underline',
        },
        blocklink: {
          flex: FLEX.one,
          borderColor: Colors[mode].borderColor,
          borderBottomWidth: BORDER_WIDTH.xs,
        },

        // Images
        image: {
          flex: 1,
        },

        // Text Output
        text: {
          fontSize: FONT_SIZE.lg,
        },
        textgroup: {},
        paragraph: {
          marginTop: MARGIN.lg,
          marginBottom: MARGIN.lg,
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
        },
        hardbreak: {
          width: '100%',
          height: 1,
        },
        softbreak: {},

        // Believe these are never used but retained for completeness
        pre: {},
        inline: {},
        span: {},
      }}
    >
      {children}
    </Markdown>
  );
};

export default MarkdownComponent;
