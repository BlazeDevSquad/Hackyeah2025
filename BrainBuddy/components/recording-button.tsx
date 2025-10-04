import React from 'react';
import { Animated, Pressable } from 'react-native';
import { styles } from '../constants/styles';
import { useThemedStyles } from '../hooks/use-themed-styles';

type Props = {
  isRecording: boolean;
  onPress: () => void;
  pulseAnim: Animated.Value;
  scaleAnim: Animated.Value;
};

export const RecordingButton = ({ isRecording, onPress, pulseAnim, scaleAnim }: Props) => {
  const { colors } = useThemedStyles();
  const animatedStyle = {
    transform: [{ scale: isRecording ? pulseAnim : scaleAnim }],
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.circle,
          { backgroundColor: colors.primary },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
};
