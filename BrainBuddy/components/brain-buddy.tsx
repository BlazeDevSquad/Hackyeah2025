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
import { useTasks } from '@/providers/tasks';
import { getOperationType, parseTaskOperation, processTaskOperations, selectTask } from '@/utils/gemini';

export default function BrainBuddy() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const { colors } = useThemedStyles();
  const { tasks, addTask, modifyTask } = useTasks();

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
        speakText("Got it, one moment...");
        try {
          const operationType = await getOperationType(finalTranscript);
          let responseText = "";

          if (operationType?.operation === 'update') {
            const geminiTasks = await parseTaskOperation(finalTranscript, tasks);
            if (geminiTasks) {
              responseText = processTaskOperations(geminiTasks, tasks, addTask, modifyTask);
            } else {
              responseText = 'Sorry, I could not understand the task. Please try again.';
            }
          } else if (operationType?.operation === 'select') {
            const suggestion = await selectTask(finalTranscript, tasks);
            if (suggestion) {
              responseText = suggestion;
            } else {
              responseText = "I couldn't come up with a suggestion right now. Please try again.";
            }
          } else if (operationType?.operation === 'unrelated') {
            responseText = "I couldn't figure out a task from that. Please click again and say a task you'd like to add or change.";
          } else {
            responseText = "I'm not sure what you're asking. Could you please rephrase?";
          }
          setGeminiResponse(responseText);
          speakText(responseText);
        } catch (error) {
          console.error('Error processing request:', error);
          const errorText = 'Sorry, an error occurred during the request.';
          setGeminiResponse(errorText);
          speakText(errorText);
        } finally {
          setIsLoading(false);
          setShowResult(true);
        }
      } else {
        console.warn('[App] No speech was detected.');
        const noSpeechText = 'No speech was detected. Please try again.';
        setGeminiResponse(noSpeechText);
        speakText(noSpeechText);
        setShowResult(true);
      }
    } else {
      startRecording();
      // speakText("Recording started, what would you like to do?");
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
