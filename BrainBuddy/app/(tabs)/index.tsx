import {
    ExpoSpeechRecognitionModule as STT,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#87ceeb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  previewBox: {
    maxWidth: '90%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultBox: {
    width: '100%',
    minHeight: 200,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 18,
    lineHeight: 28,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function BrainBuddy() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [recording, setRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partial, setPartial] = useState('');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulsating animation when recording
  useEffect(() => {
    if (recording) {
      const animation = Animated.loop(
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
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [recording]);

  // Recording timer with 60s limit
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed >= 60) {
          handleStop();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recording]);

  useSpeechRecognitionEvent('result', (e) => {
    console.log('Result event:', e);
    
    if (!e.results || e.results.length === 0) {
      console.log('No results in event');
      return;
    }

    // Get the transcript from the first result
    const result = e.results[0];
    const currentTranscript = result.transcript || '';

    console.log('isFinal:', e.isFinal);
    console.log('Transcript:', currentTranscript);

    if (e.isFinal) {
      // Final result - add to transcript
      setTranscript(prev => {
        const newTranscript = prev ? prev + ' ' + currentTranscript : currentTranscript;
        console.log('Updated final transcript:', newTranscript);
        return newTranscript;
      });
      setPartial('');
    } else {
      // Interim result - show as partial
      setPartial(currentTranscript);
    }
  });

  useSpeechRecognitionEvent('start', () => {
    console.log('Speech recognition started');
  });

  useSpeechRecognitionEvent('end', () => {
    console.log('Speech recognition ended, recording state:', recording);
    if (recording) {
      handleStop();
    }
  });

  useSpeechRecognitionEvent('error', (e) => {
    console.error('Speech recognition error:', e);
    setRecording(false);
    setPartial('');
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  useSpeechRecognitionEvent('audiostart', () => {
    console.log('Audio capturing started');
  });

  useSpeechRecognitionEvent('audioend', () => {
    console.log('Audio capturing ended');
  });

  const handlePress = async () => {
    if (showResult) {
      setShowResult(false);
      setTranscript('');
      setPartial('');
      return;
    }

    if (!recording) {
      try {
        // Check if speech recognition is available
        const available = await STT.getSupportedLocales({});
        console.log('Available locales:', available);
        
        const perm = await STT.requestPermissionsAsync();
        console.log('Permission result:', perm);
        
        if (!perm.granted) {
          console.log('Permission not granted');
          return;
        }

        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }).start();

        setTranscript('');
        setPartial('');
        
        await STT.start({
          lang: 'pl-PL',
          interimResults: true,
          continuous: true,
          maxAlternatives: 1,
          requiresOnDeviceRecognition: false,
          addsPunctuation: false,
          contextualStrings: [],
        });
        setRecording(true);
        console.log('Speech recognition started successfully');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else {
      handleStop();
    }
  };

  const handleStop = async () => {
    console.log('Stopping recording, current transcript:', transcript);
    
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setRecording(false);
    
    try {
      await STT.stop();
      console.log('Speech recognition stopped');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
    
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const backgroundColor = isDark ? '#0f172a' : '#f8fafc';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const circleColor = isDark ? '#ffffff' : '#000000';
  const buttonTextColor = isDark ? '#000000' : '#ffffff';

  if (showResult) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTitle, { color: textColor }]}>
            Transcription
          </Text>
          <View style={[styles.resultBox, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <Text style={[styles.resultText, { color: textColor }]}>
              {transcript || 'No speech detected. Please try again.'}
            </Text>
          </View>
          <Pressable 
            onPress={handlePress} 
            style={[styles.backButton, { backgroundColor: circleColor }]}
          >
            <Text style={[styles.backButtonText, { color: buttonTextColor }]}>
              New recording
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>BrainBuddy</Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          {recording ? 'Tap again to stop...' : 'Tap to start...'}
        </Text>
      </View>

      <View style={styles.circleContainer}>
        <Pressable onPress={handlePress}>
          <Animated.View
            style={[
              styles.circle,
              {
                backgroundColor: circleColor,
                transform: [
                  { scale: recording ? pulseAnim : scaleAnim }
                ],
              },
            ]}
          />
        </Pressable>

        {(transcript || partial) && !recording && (
          <View style={[styles.previewBox, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <Text style={[styles.previewText, { color: textColor }]}>
              {transcript} {partial && <Text style={{ color: subtextColor }}>{partial}</Text>}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={[styles.instructionText, { color: subtextColor }]}>
          Maximum recording time: 60s
        </Text>
      </View>
    </View>
  );
}
