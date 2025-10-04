import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Loader2 } from 'lucide-react-native';
import { ANIMATION_DURATION } from '@/constants/AppConstants';

interface LoaderLucideProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

const LucideLoader = ({
  size = 20,
  style,
  color = Colors.light.borderColor,
}: LoaderLucideProps) => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 360}deg` }],
    };
  });

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_DURATION.D10,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [progress]);

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Loader2 color={color} size={size} />
    </Animated.View>
  );
};

export default LucideLoader;
