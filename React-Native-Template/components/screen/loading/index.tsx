import { StyleSheet } from 'react-native';
import React from 'react';
import { ThemedView } from '@/components/common/view';
import LoaderLucide from '@/components/common/loader/loader';
import { ICON_SIZE } from '@/constants/AppConstants';

const LoadingScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <LoaderLucide size={ICON_SIZE.md} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
