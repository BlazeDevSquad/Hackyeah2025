import { OnboardingItem } from '@/app/(no-auth)/onboarding';

//! IMPORTANT 🚨
//? If you want to change the title, description;
// Go to the: /i18n/locales/en-US/translation.json
// And change the text in the "onboarding" section.

export const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Title 1',
    description: 'Description 1',
    lottie: require('@/assets/lotties/onboarding.json'),
    // If you want to use an image instead of a lottie, uncomment the following lines 👇
    // image: require('@/assets/images/logo.png'),
  },
  {
    id: '2',
    title: 'Title 2',
    description: 'Description 2',
    lottie: require('@/assets/lotties/onboarding1.json'),
  },
  {
    id: '3',
    title: 'Title 3',
    description: 'Description 3',
    lottie: require('@/assets/lotties/onboarding2.json'),
  },
  {
    id: '4',
    title: 'Title 4',
    description: 'Description 4',
    lottie: require('@/assets/lotties/onboarding4.json'),
  },
  {
    id: '5',
    title: 'Title 5',
    description: 'Description 5',
    lottie: require('@/assets/lotties/onboarding5.json'),
  },
];
