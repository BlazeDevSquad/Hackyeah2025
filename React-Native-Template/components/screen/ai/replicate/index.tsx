import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import Container from '@/components/common/container';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import { ThemedText } from '@/components/common/typography';
import Textarea from '@/components/common/textarea';
import {
  ANIMATION_DURATION,
  BORDER_RADIUS,
  BORDER_WIDTH,
  BUTTON_HEIGHT,
  BUTTON_WIDTH,
  FLEX,
  FONT_SIZE,
  ICON_SIZE,
  MARGIN,
  PADDING,
  ScreenWidth,
} from '@/constants/AppConstants';
import { Download, Send, Sparkle } from 'lucide-react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import AnimatedBorderButton from '@/components/common/buttons/animated-border-button';
import PressableOpacity from '@/components/common/buttons/pressable-opacity';
import { router } from 'expo-router';
import Skeleton from '@/components/common/skeleton';
import { useGenerate } from '@/hooks/useGenerate';
import { downloadImage } from '@/helpers/app-functions';
import Loader from '@/components/common/loader/loader';
import ShinyButton from '@/components/common/buttons/shiny-button';

const ReplicateAI = () => {
  const { mode } = useTheme();
  const [prompt, setPrompt] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { generateImage, generatedImage, isGenerating } = useGenerate();
  const rotationValue = useSharedValue(0);

  const handleGenerateImage = async () => {
    await generateImage(prompt, { provider: 'replicate' });
  };

  const handleShareImage = async () => {
    router.push({
      pathname: '/share-modal',
      params: {
        image: generatedImage,
      },
    });
  };

  const animatedSparkle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }],
  }));

  useEffect(() => {
    if (isGenerating) {
      rotationValue.value = withRepeat(
        withTiming(360, {
          duration: ANIMATION_DURATION.D10,
          easing: Easing.bezier(0.1, 0.5, 0.5, 1),
        }),
        -1
      );
    } else {
      rotationValue.value = withTiming(0, {
        duration: ANIMATION_DURATION.D10,
      });
    }
  }, [isGenerating, rotationValue]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: FLEX.one, backgroundColor: Colors[mode].background }}
      >
        <Container
          edges={['bottom']}
          bgColor={Colors[mode].background}
          style={{ padding: PADDING.md }}
        >
          <View style={{ gap: 16 }}>
            <ThemedText type="title">Replicate AI</ThemedText>

            <Textarea
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter image generation prompt"
              borderColor={Colors[mode].borderColor}
              color={Colors[mode].text}
              placeholderTextColor={Colors[mode].placeholderColor}
              selectionColor={Colors[mode].primary}
              cursorColor={Colors[mode].primary}
              fontSize={FONT_SIZE.md}
            />
            <AnimatedBorderButton
              onPress={handleGenerateImage}
              disabled={isGenerating}
              pathColor={Colors[mode].borderColor}
              innerContainerColor={Colors[mode].button}
              sliderColor={
                isGenerating ? Colors[mode].tertiary : Colors[mode].primary
              }
            >
              <View style={styles.sparkle}>
                <Animated.View style={[animatedSparkle]}>
                  <Sparkle
                    size={ICON_SIZE.sm}
                    color={
                      isGenerating ? Colors[mode].tertiary : Colors[mode].text
                    }
                  />
                </Animated.View>
                <ThemedText>
                  {isGenerating ? 'Generating...' : 'Generate Image'}
                </ThemedText>
              </View>
            </AnimatedBorderButton>

            {isGenerating && (
              <Skeleton
                height={ScreenWidth}
                style={{
                  borderRadius: BORDER_RADIUS.sm,
                }}
                gradientColors={[
                  Colors[mode].background,
                  Colors[mode].button,
                  Colors[mode].background,
                ]}
                backgroundColor={Colors[mode].background}
              />
            )}

            {generatedImage && !isGenerating && (
              <PressableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/image-view',
                    params: {
                      source: generatedImage,
                    },
                  });
                }}
              >
                <Image
                  source={{ uri: generatedImage }}
                  style={[
                    styles.imageContainer,
                    {
                      borderWidth: BORDER_WIDTH.xs,
                      borderColor: Colors[mode].borderColor,
                    },
                  ]}
                  placeholder={require('@/assets/placeholder.png')}
                  contentFit="cover"
                  placeholderContentFit="contain"
                  transition={ANIMATION_DURATION.D5}
                />
                <ShinyButton
                  onPress={() =>
                    downloadImage({ generatedImage, setIsDownloading })
                  }
                  disabled={isDownloading}
                  icon={
                    isDownloading ? (
                      <Loader size={ICON_SIZE.sm} color={Colors[mode].text} />
                    ) : (
                      <Download size={ICON_SIZE.sm} color={Colors[mode].text} />
                    )
                  }
                  bgColor={Colors[mode].background}
                  buttonStyle={{
                    position: 'absolute',
                    top: 12,
                    right: 8,
                    backgroundColor: Colors[mode].background,
                  }}
                  height={BUTTON_HEIGHT.sm}
                  width={BUTTON_WIDTH.sm}
                  borderRadius={BORDER_RADIUS.sm}
                  buttonColor={
                    isDownloading ? Colors[mode].tertiary : Colors[mode].primary
                  }
                />

                <PressableOpacity
                  onPress={handleShareImage}
                  style={[
                    styles.shareButton,
                    {
                      backgroundColor: Colors[mode].button,
                    },
                  ]}
                >
                  <Send size={ICON_SIZE.sm} color={Colors[mode].text} />
                </PressableOpacity>
              </PressableOpacity>
            )}
          </View>
        </Container>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: ScreenWidth,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: MARGIN.md,
    borderWidth: BORDER_WIDTH.xs,
  },
  downloadButton: {
    position: 'absolute',
    top: PADDING.sm,
    right: PADDING.sm,
  },
  shareButton: {
    position: 'absolute',
    bottom: PADDING.sm,
    right: PADDING.sm,
    padding: PADDING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  sparkle: {
    flex: FLEX.one,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ReplicateAI;
