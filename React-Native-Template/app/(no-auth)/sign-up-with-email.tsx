import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/common/view';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/common/typography';
import { useTheme } from '@/hooks/theme/useTheme';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import FormField from '@/components/common/form-field';
import { ANIMATION_DURATION, ICON_SIZE } from '@/constants/AppConstants';
import { useAuth } from '@/context/FirebaseProvider';
import { useRouter } from 'expo-router';
import Button from '@/components/common/buttons/button';
import PressableOpacity from '@/components/common/buttons/pressable-opacity';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ExternalLink } from '@/components/common/external-link';
import { authStyles } from '@/constants/AuthStyles';
import AuthButton from '@/components/common/buttons/auth';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface SignUpFormInputs extends FieldValues {
  email: string;
  password: string;
}

const SignUpWithEmail = () => {
  const { mode } = useTheme();

  const {
    signUp,
    isLoading,
    signInWithGoogle,
    signInWithApple,
    showPassword,
    handleShowPassword,
  } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await signUp(data.email, data.password);
    reset();
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollViewContent}
        style={{ backgroundColor: Colors[mode].background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={authStyles.imageTitleContainer}>
          <AnimatedImage
            entering={FadeInDown.duration(ANIMATION_DURATION.D3)}
            source={require('@/assets/images/logo.png')}
            style={authStyles.logo}
          />
          <ThemedText type="title" style={authStyles.title}>
            Sign Up
          </ThemedText>
        </ThemedView>

        <ThemedView style={authStyles.viewContainer}>
          <Animated.View entering={FadeInDown.duration(ANIMATION_DURATION.D4)}>
            <FormField<SignUpFormInputs>
              name="email"
              control={control}
              placeholder="Email"
              keyboardType="email-address"
              rightIcon={
                <Ionicons
                  name="mail-outline"
                  size={ICON_SIZE.sm}
                  color={Colors[mode].placeholderColor}
                />
              }
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email',
                },
              }}
              containerStyle={authStyles.input}
              error={errors.email?.message}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(ANIMATION_DURATION.D5)}>
            <FormField<SignUpFormInputs>
              name="password"
              control={control}
              placeholder="Password"
              secureTextEntry={!showPassword}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              containerStyle={authStyles.input}
              error={errors.password?.message}
              rightIcon={
                <PressableOpacity onPress={handleShowPassword}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={ICON_SIZE.sm}
                    color={Colors[mode].placeholderColor}
                  />
                </PressableOpacity>
              }
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(ANIMATION_DURATION.D6)}>
            <ExternalLink
              href="https://shipmobilefast.com/privacy-policy"
              style={authStyles.linkText}
            >
              <ThemedText
                type="link"
                lightColor={Colors.light.primary}
                darkColor={Colors.dark.primary}
              >
                By registering, you agree to our Terms of Service and Privacy
                Policy
              </ThemedText>
            </ExternalLink>
          </Animated.View>

          <ThemedView style={authStyles.buttonWrapper}>
            <Animated.View
              entering={FadeInDown.duration(ANIMATION_DURATION.D7)}
            >
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                bgColor={Colors[mode].primary}
                loading={isLoading}
              >
                <ThemedText
                  type="title"
                  lightColor={Colors.light.text}
                  darkColor={Colors.light.text}
                  style={authStyles.buttonText}
                >
                  Sign Up
                </ThemedText>
              </Button>
            </Animated.View>
          </ThemedView>

          <Animated.View entering={FadeInDown.duration(ANIMATION_DURATION.D8)}>
            <ThemedText style={authStyles.orText}>Or</ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(ANIMATION_DURATION.D9)}>
            <AuthButton
              onPress={signInWithGoogle}
              icon="logo-google"
              text="Continue with Google"
              disabled={isLoading}
              loading={isLoading}
            />
          </Animated.View>

          {Platform.OS === 'ios' && (
            <Animated.View
              entering={FadeInDown.duration(ANIMATION_DURATION.D10)}
            >
              <AuthButton
                onPress={signInWithApple}
                icon="logo-apple"
                text="Continue with Apple"
                disabled={isLoading}
                loading={isLoading}
              />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.duration(ANIMATION_DURATION.D11)}
            style={authStyles.bottomText}
          >
            <PressableOpacity
              onPress={() => {
                router.push('/sign-in');
              }}
              disabled={isLoading}
            >
              <ThemedText style={authStyles.linkText}>
                Already have an account?
              </ThemedText>
              <ThemedText
                type="link"
                lightColor={Colors.light.primary}
                darkColor={Colors.dark.primary}
                style={authStyles.linkText}
              >
                Sign In
              </ThemedText>
            </PressableOpacity>
          </Animated.View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpWithEmail;
