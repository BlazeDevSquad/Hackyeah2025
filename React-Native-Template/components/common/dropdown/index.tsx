import React from 'react';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import { BORDER_RADIUS, FONT_SIZE, PADDING } from '@/constants/AppConstants';

export type DropdownItem = {
  id: string;
  title: string;
  onPress?: () => void;
  icon?: string;
};

type DropdownProps = {
  items: DropdownItem[];
  trigger: React.ReactNode;
  showSeparators?: boolean;
};

export const Dropdown = ({
  items,
  trigger,
  showSeparators = true,
}: DropdownProps) => {
  const { mode } = useTheme();

  const contentStyle = {
    ...styles.content,
    backgroundColor: Colors[mode].background,
  };

  const itemStyle = {
    ...styles.item,
    backgroundColor: Colors[mode].background,
  };

  const itemTitleStyle = {
    ...styles.itemTitle,
    color: Colors[mode].text,
  };

  const separatorStyle = {
    ...styles.separator,
    backgroundColor: Colors[mode].backgroundSecondary,
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Content style={contentStyle}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <DropdownMenu.Item
              key={item.id}
              onSelect={item.onPress}
              style={itemStyle}
            >
              <DropdownMenu.ItemTitle style={itemTitleStyle}>
                {item.title}
              </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            {showSeparators && index < items.length - 1 && (
              <DropdownMenu.Separator style={separatorStyle} />
            )}
          </React.Fragment>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const styles = StyleSheet.create({
  content: {
    minWidth: 180,
    borderRadius: BORDER_RADIUS.md,
    padding: PADDING.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    paddingVertical: PADDING.sm,
    paddingHorizontal: PADDING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  itemTitle: {
    fontSize: FONT_SIZE.sm,
  },
  separator: {
    height: 1,
    marginVertical: 4,
  },
});

// Re-export primitives for advanced usage
export const DropdownPrimitives = DropdownMenu;
