# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- Git
- Expo CLI
- iOS: XCode (for iOS development)
- Android: Android Studio (for Android development)

## Step 1: Clone Repositories

First, clone both the frontend and backend repositories:

```bash
# Clone the frontend repository
git clone https://github.com/yourusername/shipmobilefast-ai.git

# Clone the backend repository
git clone https://github.com/yourusername/shipmobilefast-ai-backend.git
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add iOS and Android apps to your project:

   ### For iOS:

   - Bundle ID: your.bundle.identifier (same as in app.json)
   - Download `GoogleService-Info.plist`
   - Place it in the root directory of the frontend project

   ### For Android:

   - Package name: your.bundle.identifier (same as in app.json)
   - Download `google-services.json`
   - Place it in the root directory of the frontend project

## Step 3: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd shipmobilefast-ai-backend
   ```
2. Follow the setup instructions in the backend repository
3. Note down the generated API key

## Step 4: Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd shipmobilefast-ai
   ```

2. Create environment files:

   ```bash
   cp .env.example .env.local
   cp .env.example .env.production
   ```

3. Update the environment files with your configuration:

   ```env
   EXPO_PUBLIC_API_KEY=your_backend_api_key
   # Add other required environment variables
   ```

4. Install dependencies (choose one):

   ```bash
   # Using yarn
   yarn install

   # Using npm
   npm install

   # Using pnpm
   pnpm install

   # Using bun
   bun install
   ```

5. Verify installations:
   ```bash
   npx expo install --check
   ```

## Step 5: Running the App

### Development Build

Option 1: Using EAS

```bash
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

Option 2: Using Expo prebuild

```bash
# iOS
npx expo prebuild
npx expo run:ios

# Android
npx expo prebuild
npx expo run:android
```

## Common Issues and Troubleshooting

- If you encounter any Firebase-related issues, make sure your `GoogleService-Info.plist` and `google-services.json` are correctly placed
- For iOS build issues, try cleaning the build:
  ```bash
  cd ios && pod install && cd ..
  ```
- For Android build issues, check your local.properties file in the android folder

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
