import React from 'react';
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Container from '@/components/common/container';
import PressableOpacity from '@/components/common/buttons/pressable-opacity';
import Loader from '@/components/common/loader/loader';
import { ThemedText } from '@/components/common/typography';
import { ThemedView } from '@/components/common/view';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import { useIdentifier } from '@/hooks/useIdentifier';
import {
  Camera as CameraIcon,
  Fingerprint,
  Image as ImageIcon,
  Info,
  Scan as ScanIcon,
  Trash2Icon,
} from 'lucide-react-native';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  BUTTON_HEIGHT,
  FLEX,
  FONT_SIZE,
  ICON_SIZE,
  MARGIN,
  PADDING,
} from '@/constants/AppConstants';
import MarkdownComponent from '@/components/common/markdown';
import { router } from 'expo-router';
import AnimatedBorderButton from '@/components/common/buttons/animated-border-button';

const IdentifierScreen: React.FC = () => {
  const { mode } = useTheme();
  const { image, loading, result, pickImage, identifyImage, clearIdentifier } =
    useIdentifier();

  const handleCameraPress = () => {
    router.push('/camera-view');
  };

  return (
    <Container edges={['bottom']} bgColor={Colors[mode].background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Image Preview Section */}
          {image ? (
            <PressableOpacity
              style={styles.imageContainer}
              onPress={() => {
                router.navigate({
                  pathname: '/image-view',
                  params: {
                    source: image,
                  },
                });
              }}
            >
              <Image
                source={{ uri: image }}
                style={styles.imagePreview}
                contentFit="contain"
                transition={300}
              />
              <PressableOpacity
                onPress={clearIdentifier}
                style={styles.imageDelete}
                variant="active"
              >
                <Trash2Icon size={ICON_SIZE.sm} color={Colors.light.white} />
              </PressableOpacity>
            </PressableOpacity>
          ) : (
            <PressableOpacity
              style={[
                styles.placeholderContainer,
                { borderColor: Colors[mode].primary },
              ]}
              onPress={pickImage}
            >
              <ScanIcon size={ICON_SIZE.xxxl} color={Colors[mode].text} />
              <ThemedText style={styles.placeholderText}>
                Take or select a photo to identify
              </ThemedText>
            </PressableOpacity>
          )}

          {/* Action Buttons */}
          <ThemedView style={styles.buttonContainer}>
            <PressableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors[mode].button },
              ]}
              onPress={handleCameraPress}
            >
              <CameraIcon size={ICON_SIZE.sm} color={Colors[mode].text} />
              <ThemedText style={styles.buttonText}>Camera</ThemedText>
            </PressableOpacity>

            <PressableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors[mode].button },
              ]}
              onPress={pickImage}
            >
              <ImageIcon size={ICON_SIZE.sm} color={Colors[mode].text} />
              <ThemedText style={styles.buttonText}>Gallery</ThemedText>
            </PressableOpacity>
          </ThemedView>

          {/* Identify Button */}
          {image && (
            <AnimatedBorderButton
              onPress={() => identifyImage()}
              width="100%"
              disabled={loading}
              innerContainerColor={Colors[mode].button}
              sliderColor={
                loading ? Colors[mode].tertiary : Colors[mode].primary
              }
              pathColor={Colors[mode].borderColor}
              borderRadius={BORDER_RADIUS.sm}
              height={BUTTON_HEIGHT.md}
              sliderWidth={BUTTON_HEIGHT.sm}
            >
              {loading ? (
                <ThemedView style={styles.loaderContainer}>
                  <Loader size={ICON_SIZE.sm} color={Colors[mode].text} />
                </ThemedView>
              ) : (
                <View style={styles.identifyButton}>
                  <Fingerprint
                    size={ICON_SIZE.sm}
                    color={Colors[mode].primary}
                  />
                  <ThemedText style={[styles.identifyButtonText]}>
                    Identify Image
                  </ThemedText>
                </View>
              )}
            </AnimatedBorderButton>
          )}

          {/* Result Section */}
          {result && (
            <ThemedView style={styles.resultContainer}>
              <ThemedText style={styles.resultTitle}>
                Analysis Result
              </ThemedText>
              <MarkdownComponent>{result}</MarkdownComponent>
              <ThemedView
                style={styles.resultView}
                darkColor={Colors[mode].backgroundOpacity}
                lightColor={Colors[mode].backgroundSecondary}
              >
                <Info size={ICON_SIZE.sm} color={Colors[mode].error} />
                <ThemedText style={styles.resultSubtitle}>
                  AI can make mistakes, always verify the result.
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.one,
  },
  scrollContainer: {
    flexGrow: FLEX.one,
    padding: PADDING.lg,
    gap: PADDING.sm,
  },
  imageContainer: {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  placeholderContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: BORDER_WIDTH.md,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING.xl,
  },
  placeholderText: {
    marginTop: PADDING.md,
    textAlign: 'center',
    opacity: 0.7,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: PADDING.sm,
  },
  imageDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.light.error,
    borderRadius: BORDER_RADIUS.rounded,
    padding: PADDING.sm,
  },
  loaderContainer: {
    flex: FLEX.one,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: FLEX.one,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT.md,
    borderRadius: BORDER_RADIUS.sm,
    gap: PADDING.sm,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  identifyButtonText: {
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
  resultContainer: {
    width: '100%',
    marginTop: MARGIN.lg,
  },
  resultTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: MARGIN.sm,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.light.primary,
  },
  resultSubtitle: {
    textAlign: 'center',
    opacity: 0.5,
    fontSize: FONT_SIZE.sm,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  resultView: {
    flex: FLEX.one,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: PADDING.sm,
    padding: PADDING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: MARGIN.lg,
  },
  identifyButton: {
    flex: FLEX.one,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: PADDING.sm,
  },
});

export default IdentifierScreen;
