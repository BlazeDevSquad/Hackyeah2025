import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  FONT_SIZE,
  INPUT_HEIGHT,
  PADDING,
} from '@/constants/AppConstants';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  DimensionValue,
  TextInputProps,
  Platform,
  ViewStyle,
  TextInputFocusEventData,
  NativeSyntheticEvent,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface TextareaProps extends Omit<TextInputProps, 'multiline'> {
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  height?: DimensionValue;
  width?: DimensionValue;
  fontSize?: number;
  color?: string;
  focusScale?: number;
  minHeight?: DimensionValue;
  maxHeight?: DimensionValue;
  error?: boolean;
  disabled?: boolean;
  cursorColor?: string;
}

const Textarea = forwardRef<TextInput, TextareaProps>(
  (
    {
      value = '',
      onChangeText,
      placeholder = '',
      placeholderTextColor,
      backgroundColor,
      borderColor,
      borderWidth = BORDER_WIDTH.sm,
      selectionColor,
      borderRadius = BORDER_RADIUS.xs,
      padding = PADDING.sm,
      height = INPUT_HEIGHT.xl,
      width = '100%',
      fontSize = FONT_SIZE.md,
      color,
      onFocus,
      onBlur,
      containerStyle,
      inputContainerStyle,
      inputStyle,
      focusScale = 1.02,
      minHeight,
      maxHeight = INPUT_HEIGHT.xxxl,
      error = false,
      disabled = false,
      cursorColor,
      ...rest
    },
    ref
  ) => {
    const { mode } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handleFocus = (
      event: NativeSyntheticEvent<TextInputFocusEventData>
    ) => {
      scale.value = withTiming(focusScale, {
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      onFocus?.(event);
    };

    const handleBlur = (
      event: NativeSyntheticEvent<TextInputFocusEventData>
    ) => {
      scale.value = withTiming(1, {
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      onBlur?.(event);
    };

    const getBorderColor = () => {
      if (disabled) return Colors[mode].placeholderColor;
      if (error) return Colors[mode].error;
      return borderColor;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <Animated.View style={[animatedStyle]}>
          <View
            style={[
              styles.textareaContainer,
              {
                backgroundColor: disabled
                  ? Colors[mode].placeholderColor
                  : backgroundColor,
                borderColor: getBorderColor(),
                borderWidth,
                borderRadius,
                padding,
                height,
                width,
                minHeight,
                maxHeight,
                opacity: disabled ? 0.7 : 1,
              },
              inputContainerStyle,
            ]}
          >
            <TextInput
              ref={ref}
              style={[
                styles.input,
                {
                  fontSize,
                  color: disabled
                    ? Colors[mode].placeholderColor
                    : color || Colors[mode].text,
                },
                inputStyle,
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={
                placeholderTextColor || Colors[mode].placeholderColor
              }
              multiline={true}
              onFocus={handleFocus}
              onBlur={handleBlur}
              selectionColor={selectionColor}
              cursorColor={cursorColor}
              editable={!disabled}
              {...rest}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textareaContainer: {
    textAlignVertical: 'top',
    overflow: 'hidden',
  },
  input: {
    textAlignVertical: 'top',
    height: '100%',
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
    }),
  },
});

export default Textarea;
