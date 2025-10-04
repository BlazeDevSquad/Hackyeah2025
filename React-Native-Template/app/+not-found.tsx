import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/common/typography';
import { ThemedView } from '@/components/common/view';
import LottieView from 'lottie-react-native';
import { FLEX, MARGIN, PADDING } from '@/constants/AppConstants';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <LottieView
          source={require('@/assets/lotties/404.json')}
          style={styles.lottie}
          autoPlay
          loop
          speed={1}
        />
        <ThemedText type="title">Not Found</ThemedText>
        <Link href="/onboarding" style={styles.link}>
          <ThemedText type="link">Go to Home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: FLEX.one,
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING.lg,
  },
  link: {
    marginTop: MARGIN.lg,
    paddingVertical: PADDING.lg,
  },
  lottie: {
    width: 300,
    height: 200,
  },
});
