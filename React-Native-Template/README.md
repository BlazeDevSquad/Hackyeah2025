# Lets learn to do fast

[![Setup Guide](https://img.shields.io/badge/Setup-Guide-blue.svg)](SETUP.md)

A powerful mobile application template built with React Native and Expo, featuring AI capabilities, secure authentication, and modern mobile features.

## 🚀 Features

### Authentication & Security

- Firebase Authentication
  - Email/Password Sign In
  - Apple Sign In
  - Anonymous Sign In
  - Google Sign In (configurable)
- Secure HMAC-based API requests
- Token management and auto-refresh
- Keychain storage for sensitive data

### AI Integration

- Real-time AI chat with streaming responses
- Message history management
- Context-aware conversations
- Customizable AI endpoints

### UI/UX

- Dark/Light mode support
- Expo Router for type-safe navigation
- Toast notifications
- Loading states
- Error handling
- Responsive layouts

### Analytics & Monetization

- Google AdMob integration
- User tracking transparency handling
- RevenueCat integration for subscriptions
- PostHog analytics integration

### Development Features

- TypeScript support
- Environment configuration
- Development/Production builds
- Code organization
- Type safety

## 📁 Project Structure

```
shipmobilefast-ai/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authenticated routes
│   └── (no-auth)/         # Public routes
├── components/            # Reusable components
│   ├── features/         # Feature-specific components
│   ├── navigation/       # Navigation components
│   └── screen/          # Screen-specific components
├── context/              # React Context providers
├── hooks/               # Custom React hooks
├── helpers/             # Helper functions
├── services/            # External service integrations
├── store/              # State management
├── utils/              # Utility functions
└── constants/          # App constants
```

## 🔒 Security Features

- HMAC-based API authentication
- Secure token storage
- API request signing
- Device tracking
- Secure environment variables

## 🛠 Technical Stack

- React Native
- Expo
- Firebase
- TypeScript
- React Navigation
- Redux Toolkit
- React Native Reanimated
- Expo Router

## 📱 Supported Platforms

- iOS
- Android

## 🔧 Getting Started

See our detailed [Setup Guide](SETUP.md) for installation and configuration instructions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
