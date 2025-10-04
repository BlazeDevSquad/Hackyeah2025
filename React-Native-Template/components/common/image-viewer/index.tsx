import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from '@/components/common/view';
import { Image } from 'expo-image';
import Container from '@/components/common/container';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import {
  ANIMATION_DURATION,
  BORDER_RADIUS,
  FLEX,
  ICON_SIZE,
  PADDING,
  ScreenWidth,
} from '@/constants/AppConstants';
import { downloadImage } from '@/helpers/app-functions';
import PressableOpacity from '../buttons/pressable-opacity';
import { Download } from 'lucide-react-native';
import { ThemedText } from '@/components/common/typography';
import Loader from '@/components/common/loader/loader';
import { SnapbackZoom } from 'react-native-zoom-toolkit';

const ImageViewer = () => {
  const { source } = useLocalSearchParams();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { mode } = useTheme();

  const handleDownloadImage = () => {
    downloadImage({ generatedImage: source as string, setIsDownloading });
  };

  const resizeConfig = {
    size: { width: ScreenWidth, height: ScreenWidth },
    aspectRatio: 1,
    scale: 2,
  };

  return (
    <Container edges={['bottom']} bgColor={Colors[mode].background}>
      <ThemedView style={styles.container}>
        <SnapbackZoom resizeConfig={resizeConfig}>
          <Image
            source={{ uri: source }}
            style={styles.image}
            contentFit="contain"
            transition={ANIMATION_DURATION.D5}
            placeholder={require('@/assets/placeholder.png')}
            contentPosition="center"
            placeholderContentFit="cover"
          />
        </SnapbackZoom>
        <PressableOpacity
          onPress={handleDownloadImage}
          style={[
            styles.downloadButton,
            { backgroundColor: Colors[mode].button },
          ]}
        >
          <View style={styles.downloadView}>
            {isDownloading ? (
              <Loader size={ICON_SIZE.sm} color={Colors[mode].text} />
            ) : (
              <Download size={ICON_SIZE.sm} color={Colors[mode].text} />
            )}
            <ThemedText>
              {isDownloading ? 'Downloading' : 'Download'}
            </ThemedText>
          </View>
        </PressableOpacity>
      </ThemedView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.one,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  downloadButton: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: PADDING.sm,
    padding: PADDING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  downloadView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PADDING.sm,
  },
});

export default ImageViewer;
