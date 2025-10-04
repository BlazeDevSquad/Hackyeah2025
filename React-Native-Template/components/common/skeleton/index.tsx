import React from 'react';
import { DimensionValue, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  /**
   * Duration of one complete animation cycle in milliseconds
   * @default 2000
   */
  duration?: number;
  /**
   * Background color of the skeleton
   * @default '#2A2A2A'
   */
  backgroundColor?: string;
  /**
   * Gradient colors for the sliding effect
   */
  gradientColors?: LinearGradientProps['colors'];
  /**
   * Start animation with delay (ms)
   * @default 0
   */
  startDelay?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 12,
  borderRadius = 6,
  style,
  duration = 2000,
  backgroundColor = '#2A2A2A',
  gradientColors = ['#2A2A2A', '#3A3A3A', '#2A2A2A'],
  startDelay = 0,
}) => {
  const translateX = useSharedValue(-500);

  React.useEffect(() => {
    translateX.value = withDelay(
      startDelay,
      withRepeat(
        withSequence(
          withTiming(-500, { duration: 0 }),
          withTiming(500, { duration: duration })
        ),
        -1
      )
    );
  }, [duration, startDelay, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.gradientWrapper, animatedStyle]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradientWrapper: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: 300,
    height: '100%',
  },
});

export default Skeleton;
