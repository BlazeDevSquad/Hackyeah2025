import {
    ExpoSpeechRecognitionModule as STT,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulsating animation
  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => animation?.stop();
  }, [isRecording]);
  
  // 60-second recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setTimeout(() => {
        stopRecording();
      }, 60000); // 60 seconds
    }
    return () => clearTimeout(timer);
  }, [isRecording]);

  useSpeechRecognitionEvent('result', (e) => {
    if (!e.results?.length) return;

    const result = e.results[0];
    const currentTranscript = result.transcript || '';

    if (e.isFinal) {
      setTranscript(prev => prev ? `${prev} ${currentTranscript}` : currentTranscript);
      setPartialTranscript('');
    } else {
      setPartialTranscript(currentTranscript);
    }
  });

  useSpeechRecognitionEvent('end', () => {
    if (isRecording) {
      stopRecording();
    }
  });
  
  useSpeechRecognitionEvent('error', (e) => {
    console.error('Speech recognition error:', e);
    setIsRecording(false);
    setPartialTranscript('');
    Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  });

  const startRecording = async () => {
    try {
      const permissions = await STT.requestPermissionsAsync();
      if (!permissions.granted) {
        console.warn('Speech recognition permission not granted');
        return;
      }
      
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true }).start();
      setTranscript('');
      setPartialTranscript('');
      
      await STT.start({
        lang: 'pl-PL',
        interimResults: true,
        continuous: true,
      });
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  };

  const stopRecording = async () => {
    Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setIsRecording(false);
    try {
      await STT.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };
  
  const reset = () => {
    setTranscript('');
    setPartialTranscript('');
  };

  return {
    isRecording,
    transcript,
    partialTranscript,
    pulseAnim,
    scaleAnim,
    startRecording,
    stopRecording,
    reset,
  };
};
