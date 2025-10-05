import {ExpoSpeechRecognitionModule as STT, useSpeechRecognitionEvent,} from 'expo-speech-recognition';
import {useEffect, useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');

  const transcriptRef = useRef('');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setTimeout(() => {
        console.log('[STT] 60-second recording limit reached. Stopping automatically.');
        stopRecording();
      }, 60000);
    }
    return () => clearTimeout(timer);
  }, [isRecording]);

 useSpeechRecognitionEvent('result', (e) => {
    if (!e.results?.length) return;

    const allTranscripts = e.results.map(result => result.transcript).join(' ');
    
    const finalTranscript = e.results
      .filter(result => result.isFinal)
      .map(result => result.transcript)
      .join(' ');
      
    const partialTranscript = e.results
      .filter(result => !result.isFinal)
      .map(result => result.transcript)
      .join(' ');

    setTranscript(finalTranscript);
    setPartialTranscript(partialTranscript);

    transcriptRef.current = allTranscripts.trim() || (finalTranscript + ' ' + partialTranscript).trim();
  });

  useSpeechRecognitionEvent('end', () => {
    if (isRecording) {
      setIsRecording(false);
    }
  });

  useSpeechRecognitionEvent('error', (e) => {
    console.error('[STT] Speech recognition error:', e);
    setIsRecording(false);
    setPartialTranscript('');
    Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  });

  const startRecording = async () => {
    console.log('[STT] Attempting to start recording...');
    try {
      const permissions = await STT.requestPermissionsAsync();
      if (!permissions.granted) {
        console.warn('[STT] Speech recognition permission not granted.');
        return;
      }
      
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true }).start();
      
      reset();

        STT.start({
            lang: 'en-US',
            interimResults: true,
            continuous: true,
        });

      setIsRecording(true);
    } catch (error) {
      console.error('[STT] Failed to start speech recognition:', error);
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  };

  const stopRecording = async (): Promise<string> => {
    console.log('[STT] Attempting to stop recording...');
    Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setIsRecording(false);
    try {
    STT.stop();
    } catch (error)  {    
      console.error('[STT] Error stopping speech recognition:', error);
    }
    console.log(`[DEBUG] Got finalTranscript: ${transcriptRef.current}`);
    return transcriptRef.current;
  };
  
  const reset = () => {
    setTranscript('');
    setPartialTranscript('');
    transcriptRef.current = '';
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
