# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

XSALE is a React Native mobile app (classifieds/marketplace platform) that runs on Android and iOS. It allows users to browse and post listings across multiple categories (vehicles, mobile phones, animals, property, jobs, etc.), chat with sellers, and manage their profiles.

**Key Technologies:**
- React Native 0.73.3
- React Navigation (native stack + bottom tabs)
- Firebase (Authentication, Messaging, Firestore, Analytics, Crashlytics)
- Google Mobile Ads (AdMob)
- Axios for HTTP requests
- Encrypted Storage for sensitive data
- AWS Lambda backend API

## Commands

### Development Setup
```bash
npm start              # Start Metro bundler (required first)
npm run android        # Build and run on Android emulator (with dev env)
npm run ios            # Run on iOS simulator
npm run android:prod   # Build and run on Android with prod env
npm run start:prod     # Start Metro with prod environment
```

### Building & Distribution
```bash
npm run apk            # Build production APK (release)
npm run apk:dev        # Build debug APK
npm run bundle         # Build production App Bundle for Play Store
```

### Code Quality
```bash
npm lint               # Run ESLint
npm test               # Run Jest tests
```



## Environment Configuration

The app uses a pre-build script to inject environment variables:
- **Source files:** `.env` (dev) and `.env.production` (prod)
- **Generated file:** `src/config/env-config.js` (auto-generated, do not edit)
- **Script:** `src/utils/generate-env.js`

The script runs automatically during `npm install` (postinstall hook) and explicitly when running any build command. To use a specific environment:
```bash
node src/utils/generate-env.js dev   # Generate from .env
node src/utils/generate-env.js prod  # Generate from .env.production
```

Exported constants include:
- `API_BASE_URL` - Backend API endpoint
- `GOOGLE_MAPS_KEY` - Google Maps API key
- `ADMOB_*` - AdMob unit IDs for various screens

## Directory Structure

```
src/
├── screens/              # Full-page components for each route
│   ├── auth/            # Authentication screens (OTP, location, name)
│   ├── home/            # Home, categories, product listing, search
│   ├── addNewListing/   # Category-specific listing forms (Animals, Mobile, etc.)
│   ├── ViewAd/          # Viewing product details
│   ├── chats/           # Chat/messaging screens
│   ├── myAds/           # User's posted listings
│   └── profile/         # User profile and settings
├── component/           # Reusable components
│   ├── shared/          # Buttons, inputs, modals, headers
│   ├── Home/            # Home-specific components (filters, categories)
│   ├── addNewListing/   # Listing form components
│   ├── Chats/           # Chat UI components
│   ├── myAds/           # My ads UI components
│   └── viewAd.js/       # Seller profile display
├── utils/
│   ├── env.js           # Environment variable wrapper/export
│   ├── requestBuilder.js # HTTP request utilities (get, post, put, delete, uploadMediaToServer)
│   ├── generate-env.js  # Env config generation script
│   └── function.js      # Utility helpers
├── config/
│   └── env-config.js    # AUTO-GENERATED environment constants (do not edit)
└── assets/
    ├── colors/
    ├── styles/
    ├── icons/
    └── images/
```

## Navigation & Routing

The app uses React Navigation with two main navigator types:
- **Stack Navigator:** Primary navigation between screens
- **Bottom Tab Navigator:** Available on certain screens (likely Home, MyAds, Chats, Profile)

Entry point: `App.js` defines all routes using `createNativeStackNavigator()`. Deep linking is configured for Firebase notifications (Chats route).

Key navigation pattern:
1. Auth flow: FirstScreen → MobileNumber → OtpScreen → NameScreen → Location → ChooseLocation → Home
2. From Home: Browse categories → ProductsListing → ViewAd, or add new listings via AddNewListing

## State Management & Storage

- **User Data:** Stored in encrypted storage (`EncryptedStorage`) with key `'userData'` containing user token and profile info
- **Subscriptions:** Daily notification subscription tracked in AsyncStorage (`'xsale_daily_subscribed'`)
- No centralized state management (Redux/Context API) - state appears to be local to screens

## API Integration

HTTP requests go through `src/utils/requestBuilder.js`:
- **get(url, useToken)** - GET requests with optional auth
- **post(url, body, useToken)** - POST requests with optional auth
- **put(url, body, useToken)** - PUT requests (auth defaults to true)
- **patch(url, body, token)** - PATCH requests using Fetch API
- **deleteApi(url, body, useToken)** - DELETE requests with optional auth
- **uploadMediaToServer(mediaArray)** - Multipart file upload

All requests automatically include `'X-Platform': 'mobile'` header.
Response format: `{ status: number, response: any }`

Base URL: Configured via `API_BASE_URL` from env-config.js (AWS Lambda API Gateway)

## Firebase Configuration

Set up in `index.js` and `App.js`:
- Background message handler for push notifications
- App open ads
- Daily topic subscription (`'xsale_daily'`)
- Deep linking for notification navigation to Chats

## Key Patterns & Conventions

1. **Screen vs Component:** Screens are route-level components in `src/screens/`; reusable UI pieces are in `src/component/`
2. **Category-Specific Screens:** Each product category (Animals, Mobile, Vehicles, etc.) has its own folder with index.js exporting the main screen
3. **Image/Media Handling:** Uses react-native-image-picker, react-native-image-crop-picker, and react-native-image-resizer
4. **Maps Integration:** react-native-google-maps and react-native-google-places-autocomplete for location selection
5. **Form Handling:** No dedicated form library (Formik/React Hook Form); appears to be local state in components

## Common Development Tasks

### Adding a New Screen
1. Create the screen component in `src/screens/feature-name/ScreenName.js`
2. **Export it from the folder's `index.js`** (e.g., `src/screens/feature-name/index.js`)
3. **Import it in `App.js`** from the folder index
4. **Add a `<Stack.Screen>` route in `App.js`** inside the Stack.Navigator

### Adding a Reusable Component
1. Create in appropriate subfolder under `src/component/` (e.g., `shared/`, `Home/`)
2. Export from `src/component/[folder]/index.js` for easier imports
3. Use throughout app via relative imports

### Making API Calls
```javascript
import { get, post, put } from '../utils/requestBuilder';
const result = await post('api/v1/endpoint', { data }, true); // true = use auth token
if (result.status === 200) { /* success */ }
```

### Accessing Environment Variables
```javascript
import { API_BASE_URL, admobHomeBanner } from '../utils/env';
```

## Testing

Jest is configured. Run with `npm test`. No test files observed in current codebase - consider adding tests for utility functions and business logic.

## Known Build Considerations

- Android builds: `npm run android` kills existing Metro server on port 8081 before building
- Environment generation must happen before compilation (handled by postinstall + explicit calls)
- Check `.env` and `.env.production` files exist in project root with all required keys
- Ensure `.env` keys match exports in `src/config/env-config.js`

## Git Workflow

Current branch: `shamir/develop`
Main branch: `master`

The codebase follows a feature branch workflow. Keep environment files (`.env`, `.env.production`) out of version control if they contain secrets.
