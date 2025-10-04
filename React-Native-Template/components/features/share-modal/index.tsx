import React, { useRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import ViewShot from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from '@/components/common/view';
import ShareBottomSheet from '@/components/common/modal/share-bottom-sheet';
import {
  LOGO_SIZE,
  MARGIN,
  PADDING,
  BORDER_RADIUS,
  FONT_SIZE,
  Z_INDEX,
  FLEX,
  ScreenWidth,
  ScreenHeight,
} from '@/constants/AppConstants';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/theme/useTheme';
import { BlurView } from 'expo-blur';

export default function ShareModal() {
  const { image } = useLocalSearchParams();
  const { mode } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);
  const colors = [Colors[mode].primary, Colors[mode].backgroundOpacity];
  const secondColors = [Colors[mode].primary, Colors[mode].background];

  const SpotifyShareScreen = () => (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={colors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1.0 }}
        style={[styles.gradientBackground]}
      >
        <ViewShot ref={viewShotRef} style={styles.spotifyContainer}>
          <LinearGradient
            colors={secondColors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.0 }}
            style={styles.cardContainer}
          >
            <Image
              source={{
                uri: image,
              }}
              style={styles.albumCover}
              contentFit="cover"
            />
            {Platform.OS === 'ios' ? (
              <BlurView intensity={20} tint={mode} style={styles.footer}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                />
              </BlurView>
            ) : (
              <ThemedView style={styles.footer}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                />
              </ThemedView>
            )}
          </LinearGradient>
        </ViewShot>
      </LinearGradient>
    </ThemedView>
  );

  return (
    <>
      <SpotifyShareScreen />
      <ShareBottomSheet ref={viewShotRef} colors={colors} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: FLEX.one,
  },

  spotifyLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MARGIN.lg,
  },

  spotifyContainer: {
    alignItems: 'center',
  },
  gradientBackground: {
    aspectRatio: 9 / 16,
    flex: 0.83,
    margin: MARGIN.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'center',
  },
  cardContainer: {
    borderRadius: BORDER_RADIUS.md,
    padding: PADDING.sm,
    zIndex: Z_INDEX.one,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  albumCover: {
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: MARGIN.sm,
    width: ScreenWidth * 0.7,
    height: ScreenHeight * 0.5,
  },
  logo: {
    width: LOGO_SIZE.xxxs,
    height: LOGO_SIZE.xxxs,
  },
  songTitle: {
    fontSize: FONT_SIZE.lg,
  },
  artistName: {
    fontSize: FONT_SIZE.sm,
  },
  spotifyLogo: {
    marginRight: MARGIN.sm,
  },
  shareOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: MARGIN.sm,
  },
  footer: {
    marginTop: MARGIN.xl,
    alignItems: 'center',

    position: 'absolute',
    bottom: 15,
    right: 12,
    zIndex: Z_INDEX.one,
    padding: PADDING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  spotifyText: {
    fontSize: FONT_SIZE.sm,
    marginLeft: MARGIN.md,
  },
  withLove: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginTop: MARGIN.lg,
  },
});
