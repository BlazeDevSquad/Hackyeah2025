import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from '../constants/styles';
import useGemini from '../hooks/use-gemini';
import { useSpeechRecognition } from '../hooks/use-speech-recognition';
import { useThemedStyles } from '../hooks/use-themed-styles';
import { Header } from './header';
import { Instructions } from './instructions';
import { LoadingView } from './loading-view';
import { RecordingButton } from './recording-button';
import { ResultView } from './result-view';

export default function BrainBuddy() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const { colors } = useThemedStyles();
  const { sendToGemini } = useGemini();

  const {
    isRecording,
    transcript,
    pulseAnim,
    scaleAnim,
    startRecording,
    stopRecording,
    reset,
  } = useSpeechRecognition();

  const handlePress = async () => {
    if (isRecording) {
      console.log('[DEBUG] Stopping recording...');
      await stopRecording();
      
      // Use a short timeout to ensure the final transcript is captured
      setTimeout(async () => {
        console.log(`[DEBUG] Final Transcript captured: "${transcript}"`);
        
        if (transcript) {
          console.log('[DEBUG] Setting loading state to: true');
          setIsLoading(true);
          try {
            console.log(`[DEBUG] Sending to Gemini API: "${transcript}"`);
            const response = await sendToGemini(transcript);
            console.log(`[DEBUG] Received from Gemini API: "${response}"`);
            setGeminiResponse(response);
          } catch (error) {
            console.error('[DEBUG] Error sending to Gemini API:', error);
            setGeminiResponse('Sorry, an error occurred during the request.');
          } finally {
            console.log('[DEBUG] Setting loading state to: false');
            setIsLoading(false);
            console.log('[DEBUG] Setting showResult state to: true');
            setShowResult(true);
          }
        } else {
            console.warn('[DEBUG] No speech was detected.');
            setGeminiResponse('No speech was detected. Please try again.');
            setShowResult(true);
        }
      }, 500);
    } else {
      console.log('[DEBUG] Starting recording...');
      startRecording();
    }
  };

  const handleReset = () => {
    console.log('[DEBUG] Resetting state for new recording.');
    reset();
    setGeminiResponse('');
    setShowResult(false);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (showResult) {
    return <ResultView geminiResponse={geminiResponse} onReset={handleReset} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header isRecording={isRecording} />

      <View style={styles.circleContainer}>
        <RecordingButton
          isRecording={isRecording}
          onPress={handlePress}
          pulseAnim={pulseAnim}
          scaleAnim={scaleAnim}
        />
      </View>

      <Instructions />
    </View>
  );
}
