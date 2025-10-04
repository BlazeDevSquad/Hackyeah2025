import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from '@/constants/styles';
import {useSpeechRecognition} from '@/hooks/use-speech-recognition';
import {useThemedStyles} from '@/hooks/use-themed-styles';
import {Header} from './header';
import {Instructions} from './instructions';
import {LoadingView} from './loading-view';
import {RecordingButton} from './recording-button';
import {ResultView} from './result-view';
import {speakText} from "@/utils/tts";

export default function BrainBuddy() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const { colors } = useThemedStyles();

  const {
    isRecording,
    transcript,
    partialTranscript,
    pulseAnim,
    scaleAnim,
    startRecording,
    stopRecording,
    reset,
  } = useSpeechRecognition();

  const handlePress = async () => {
    if (isRecording) {
      const finalTranscript = await stopRecording();
      console.debug(`Got finalTranscript: ${finalTranscript}`)
      
      if (finalTranscript) {
        setIsLoading(true);
        try {
          // TODO: Use gemini and add to storage
          // const response = await sendToGemini(finalTranscript);
          setGeminiResponse('Your request was processed successfully!');
        } catch (error) {
          console.error('Error sending to Gemini API:', error);
          setGeminiResponse('Sorry, an error occurred during the request.');
        } finally {
          setIsLoading(false);
          setShowResult(true);
        }
      } else {
        console.warn('[App] No speech was detected.');
        setGeminiResponse('No speech was detected. Please try again.');
        setShowResult(true);
      }
    } else {
      startRecording();
    }
  };

  const handleReset = () => {
    reset();
    setGeminiResponse('');
    setShowResult(false);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (showResult) {
      speakText(geminiResponse)
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
