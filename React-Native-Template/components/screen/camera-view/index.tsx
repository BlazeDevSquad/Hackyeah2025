import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { ScanIcon, ImageIcon, Zap } from 'lucide-react-native';
import { useIdentifier } from '@/hooks/useIdentifier';
import { Colors } from '@/constants/Colors';
import PressableOpacity from '@/components/common/buttons/pressable-opacity';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  FLEX,
  ICON_SIZE,
  PADDING,
  ScreenWidth,
} from '@/constants/AppConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/theme/useTheme';

const CameraView = () => {
  const { mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const { pickImage, processImage } = useIdentifier();
  const [flashLight, setFlashLight] = useState(false);

  const handlePickImage = async () => {
    try {
      await pickImage();
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick an image');
    } finally {
      router.back();
    }
  };

  const handleCapture = async () => {
    if (!device) return;
    try {
      const photo = await camera.current?.takePhoto();
      if (photo) {
        await processImage(photo.path);
      }
    } catch (error) {
      console.error('Camera capture error:', error);
    } finally {
      router.back();
    }
  };

  if (!hasPermission) {
    requestPermission();
    return null;
  }

  if (!device) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        photo={true}
        video={false}
        torch={flashLight ? 'on' : 'off'}
      />

      {/* Camera UI */}
      <View style={styles.cameraOverlay}>
        {/* Camera Frame */}
        <View style={styles.cameraFrame}>
          <ScanIcon
            size={ScreenWidth}
            color={Colors.light.white}
            strokeWidth={0.3}
          />
        </View>

        {/* Bottom Controls */}
        <View style={[styles.cameraControls, { paddingBottom: insets.bottom }]}>
          <PressableOpacity onPress={handlePickImage}>
            <ImageIcon size={ICON_SIZE.md} color={Colors.light.white} />
          </PressableOpacity>

          <PressableOpacity
            onPress={handleCapture}
            style={styles.captureButton}
          >
            <View style={styles.captureButtonInner} />
          </PressableOpacity>

          <PressableOpacity onPress={() => setFlashLight(!flashLight)}>
            <Zap
              size={ICON_SIZE.md}
              color={flashLight ? Colors[mode].primary : Colors.light.white}
            />
          </PressableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraOverlay: {
    flex: FLEX.one,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cameraFrame: {
    flex: FLEX.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: PADDING.xl,
  },
  galleryButton: {
    width: ICON_SIZE.lg,
    height: ICON_SIZE.lg,
    borderRadius: BORDER_RADIUS.xs,
  },
  captureButton: {
    width: ICON_SIZE.xxxl,
    height: ICON_SIZE.xxxl,
    borderRadius: BORDER_RADIUS.rounded,
    backgroundColor: Colors.light.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: ICON_SIZE.xxl,
    height: ICON_SIZE.xxl,
    borderRadius: BORDER_RADIUS.rounded,
    borderWidth: BORDER_WIDTH.md,
    borderColor: Colors.light.black,
  },
  infoButton: {
    width: ICON_SIZE.md,
    height: ICON_SIZE.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: BORDER_WIDTH.md,
    borderColor: Colors.light.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: Colors.light.text,
    fontWeight: 'bold',
  },
});

export default CameraView;
