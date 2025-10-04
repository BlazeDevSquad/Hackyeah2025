import Container from '@/components/common/container';
import { Colors } from '@/constants/Colors';
import { useState, useRef, useCallback } from 'react';
import { useTheme } from '@/hooks/theme/useTheme';
import { FlatList, StyleSheet } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { PADDING } from '@/constants/AppConstants';
import Bubble from '@/components/common/chat/bubble';
import Footer from '@/components/common/chat/footer';
import Input from '@/components/common/chat/chat-input';
import { useChat } from '@/hooks/useChat';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Message } from '@/utils/types';

const PADDING_BOTTOM = PADDING.lg;

const ChatScreen: React.FC = () => {
  // We are defining the endpoint to send message to the server
  const endpoint = 'ai/openai/stream';
  const { mode } = useTheme();
  const [inputText, setInputText] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);
  const [showFooter, setShowFooter] = useState<boolean>(false);
  const height = useSharedValue<number>(PADDING_BOTTOM);

  // Used to send message to the server
  const { messages, isLoading, sendMessage, stopGenerating } = useChat({
    endpoint,
    onMessageComplete: () => {
      // This is used to show the footer after the message is sent
      setShowFooter(true);
      setTimeout(() => {
        // This is used to scroll to the bottom of the list after the message is sent
        flatListRef.current?.scrollToEnd();
      }, 300);
    },
  });

  // This is used to show input bar when keyboard is shown
  useKeyboardHandler({
    onMove: (event) => {
      'worklet';
      height.value = Math.max(event.height, PADDING_BOTTOM);
    },
  });

  // This is used to show input bar when keyboard is shown
  const fakeViewStyle = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
      marginBottom: height.value > 0 ? 0 : PADDING_BOTTOM,
    };
  });

  // This is used to send message to the server
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    setShowFooter(false);
    const messageText = inputText.trim();
    setInputText('');

    await sendMessage({
      message: messageText,
      onProgress: () => {
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToEnd();
        });
      },
    });
  }, [inputText, isLoading, sendMessage]);

  // This is used to render the message
  const renderMessage = useCallback(({ item }: { item: Message }) => {
    return <Bubble item={item} />;
  }, []);

  return (
    <Container edges={['left', 'right']} bgColor={Colors[mode].background}>
      <FlatList
        ref={flatListRef}
        style={styles.container}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={[
          styles.messageList,
          { paddingBottom: PADDING.xl },
        ]}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={showFooter ? <Footer messages={messages} /> : null}
        inverted={false}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd();
        }}
      />

      <Input
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSendMessage}
        isLoading={isLoading}
        onStop={stopGenerating}
      />
      <Animated.View style={fakeViewStyle} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: PADDING.sm,
    paddingVertical: PADDING.md,
  },
});

export default ChatScreen;
