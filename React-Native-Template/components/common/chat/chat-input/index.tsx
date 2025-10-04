import { TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import { ArrowUp } from 'lucide-react-native';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  BUTTON_HEIGHT,
  FLEX,
  ICON_SIZE,
  INPUT_HEIGHT,
  MARGIN,
  PADDING,
} from '@/constants/AppConstants';
import { ThemedView } from '@/components/common/view';
import { GlowButton } from '../../buttons/glow-button';
import { FontAwesome } from '@expo/vector-icons';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop?: () => void;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  onSend,
  isLoading,
  onStop,
}) => {
  const { mode } = useTheme();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          borderColor: Colors[mode].borderColor,
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        placeholderTextColor={Colors[mode].placeholderColor}
        style={[
          styles.input,
          {
            color: Colors[mode].text,
          },
        ]}
        multiline
        selectionColor={Colors[mode].primary}
      />
      <GlowButton
        onPress={() => {
          if (!isLoading) {
            onSend();
          } else {
            onStop?.();
          }
        }}
        width={BUTTON_HEIGHT.xs}
        height={BUTTON_HEIGHT.xs}
        borderRadius={BORDER_RADIUS.xl}
        bgColor={Colors[mode].backgroundOpacity}
        colors={[
          Colors[mode].backgroundOpacity,
          isLoading ? Colors[mode].primary : '#e2e2e2',
          Colors[mode].backgroundOpacity,
        ]}
        style={styles.button}
      >
        {isLoading ? (
          <FontAwesome
            name="stop"
            size={ICON_SIZE.xxs}
            color={Colors[mode].text}
          />
        ) : (
          <ArrowUp
            width={ICON_SIZE.xs}
            height={ICON_SIZE.xs}
            color={Colors[mode].text}
          />
        )}
      </GlowButton>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BORDER_WIDTH.sm,
    padding: PADDING.xs,
    margin: MARGIN.md,
    marginHorizontal: MARGIN.lg,
    maxHeight: INPUT_HEIGHT.xxxl,
    borderRadius: BORDER_RADIUS.md,
  },
  input: {
    flex: FLEX.one,
    paddingVertical: PADDING.xs,
    paddingHorizontal: PADDING.md,
  },
  button: {
    alignSelf: 'flex-start',
  },
});

export default Input;
