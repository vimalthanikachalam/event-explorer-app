# Event Explorer app

This Expo app includes:

- Firebase Authentication and Firestore (email/password)
- AsyncStorage for local caching of user profile
- Biometric login (Face ID / Touch ID) via expo-local-authentication
- Redux Toolkit for state management
- Clean, modular structure with common hooks, services, and storage utils

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure Firebase

   Create a Firebase project and add a web app. Copy the config values and set these environment variables (used by `app.json -> expo.extra.firebase`):

   ```bash
   export FIREBASE_API_KEY=...
   export FIREBASE_AUTH_DOMAIN=...
   export FIREBASE_PROJECT_ID=...
   export FIREBASE_STORAGE_BUCKET=...
   export FIREBASE_MESSAGING_SENDER_ID=...
   export FIREBASE_APP_ID=...
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

Auth flows:

- Sign in: `/(auth)/sign-in`
- Sign up: `/(auth)/sign-up`
- Forgot password: `/(auth)/forgot-password`

After sign-in, you'll land on `/(app)`.

Security notes:

- Sensitive tokens should be stored via `expo-secure-store` (see `common/storage/secureStore.ts`).
- Firebase config is read from environment variables injected via `app.json -> expo.extra.firebase`.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
