import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from '../constants/styles';
import { useSpeechRecognition } from '../hooks/use-speech-recognition';
import { useThemedStyles } from '../hooks/use-themed-styles';
import { Header } from './header';
import { Instructions } from './instructions';
import { PreviewBox } from './preview-box';
import { RecordingButton } from './recording-button';
import { ResultView } from './result-view';

export default function BrainBuddy() {
  const [showResult, setShowResult] = useState(false);
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

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
      // Wait for the final transcript to be processed
      setTimeout(() => setShowResult(true), 500);
    } else {
      startRecording();
    }
  };

  const handleReset = () => {
    reset();
    setShowResult(false);
  };
  
  if (showResult) {
    return <ResultView transcript={transcript} onReset={handleReset} />;
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
        <PreviewBox
          transcript={transcript}
          partialTranscript={partialTranscript}
        />
      </View>

      <Instructions />
    </View>
  );
}
