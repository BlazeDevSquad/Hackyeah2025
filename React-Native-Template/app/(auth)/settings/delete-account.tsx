import React, { useCallback, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import RadioButton from '@/components/common/buttons/radio-button';
import { ThemedView } from '@/components/common/view';
import { ThemedText } from '@/components/common/typography';
import Dialog from '@/components/common/modal/dialog';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/theme/useTheme';
import {
  BORDER_RADIUS,
  BUTTON_HEIGHT,
  FLEX,
  FONT_SIZE,
  MARGIN,
  PADDING,
} from '@/constants/AppConstants';
import { DeleteAccountReasons } from '@/data/DeleteAccount';
import AnimatedBorderButton from '@/components/common/buttons/animated-border-button';

const DeleteAccountScreen: React.FC = () => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const { mode } = useTheme();

  const handleSelectReason = useCallback((reason: string) => {
    setSelectedReason(reason);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Delete Account
      </ThemedText>
      <ThemedText type="default" style={styles.subtitle}>
        Are you sure you want to delete your account?
      </ThemedText>
      <FlatList
        data={DeleteAccountReasons}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.gridItem}>
            <RadioButton
              selected={selectedReason === item.value}
              onSelect={() => handleSelectReason(item.value)}
              label={item.label}
              labelStyle={{
                fontSize: FONT_SIZE.md,
              }}
              color={Colors[mode].error}
              accessibilityLabel={item.label}
              height={BUTTON_HEIGHT.md}
            />
          </View>
        )}
      />
      <Dialog
        title={'Delete Account'}
        description={'Are you sure you want to delete your account?'}
        bgColor={Colors[mode].button}
        rightButton={'Delete'}
        visible={visible}
        setVisible={setVisible}
      >
        <AnimatedBorderButton
          onPress={() => {
            setVisible(true);
          }}
          pathColor={Colors[mode].background}
          sliderColor={Colors[mode].error}
          borderRadius={BORDER_RADIUS.sm}
          innerContainerColor={Colors[mode].error}
          width={'100%'}
          height={BUTTON_HEIGHT.md}
          sliderWidth={50}
        >
          <View
            style={{
              flex: FLEX.one,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText
              type="default"
              style={styles.deleteButton}
              darkColor={Colors.dark.text}
              lightColor={Colors.dark.text}
            >
              Delete
            </ThemedText>
          </View>
        </AnimatedBorderButton>
      </Dialog>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.one,
    padding: PADDING.md,
    gap: 4,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: MARGIN.xl,
    textAlign: 'center',
  },
  gridItem: {
    flex: FLEX.one,
    marginVertical: MARGIN.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
  },
});

export default DeleteAccountScreen;
