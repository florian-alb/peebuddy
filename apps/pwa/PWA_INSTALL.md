# PWA Install Button

This PWA includes a smart install button that automatically detects the user's platform and provides appropriate installation instructions.

## Features

- **Automatic Platform Detection**: Detects if the user is on iOS, Android, or desktop
- **Native Install Prompt**: Uses the browser's native install prompt for Android/Chrome
- **iOS Instructions**: Shows step-by-step instructions for iOS users
- **Installation State Management**: Automatically hides the button once the app is installed
- **Responsive Design**: Works on all screen sizes

## Components

### PWAInstallPrompt

The main component that handles the install button display and logic.

### usePWAInstall Hook

A custom hook that manages the PWA installation state and provides installation methods.

## Usage

```tsx
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";

export default function MyPage() {
  return (
    <div>
      <h1>My PWA</h1>
      <PWAInstallPrompt />
    </div>
  );
}
```

## How it Works

1. **Detection**: The hook detects if the app is already installed or if it can be installed
2. **Platform Check**: Determines if the user is on iOS or Android/Chrome
3. **Install Prompt**:
   - For Android/Chrome: Shows the native browser install prompt
   - For iOS: Shows custom instructions for manual installation
4. **State Management**: Automatically updates the UI based on installation status

## Requirements

- PWA manifest properly configured
- HTTPS enabled (required for PWA installation)
- Service worker registered
- Icons in the correct sizes (192x192 and 512x512)

## Browser Support

- Chrome/Edge: Full support with native install prompt
- Safari (iOS): Manual installation via share button
- Firefox: Limited support
- Other browsers: Fallback to manual installation instructions
