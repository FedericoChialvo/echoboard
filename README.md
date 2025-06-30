# EchoBoard

EchoBoard is a proof of concept Accessible AAC (Augmentative and Alternative Communication) Communication App designed to explore better talker app UX. The app helps users communicate effectively through symbols, text, and speech synthesis.

**🚀 Ultra-Lightweight Package: Just 319 KB total!** Perfect for quick deployment and minimal storage requirements.

**Created by Federico Chialvo and Dean Sitton**

## Features

- **Symbol-based Communication**: Navigate through categories of symbols (Basic, Emotions, Actions, Custom)
- **Expandable Symbol Library**: Easy customization and unlimited symbol additions
- **Text-to-Speech**: Built-in speech synthesis with customizable voice, rate, and pitch
- **On-screen Keyboard**: Accessible keyboard for text input
- **Quick Phrases**: Pre-configured common phrases for quick access
- **Progressive Web App (PWA)**: Works offline and can be installed on devices for native app-like experience
- **Mobile Support**: Built with Capacitor for native mobile app deployment
- **Accessibility**: Screen reader compatible with ARIA labels and keyboard navigation
- **Local Server Capable**: Easy setup for multi-device access and PWA installation

## Symbol Library Expandability

EchoBoard features a highly expandable symbol system designed for easy customization:

### Built-in Categories
- **Basic**: Essential communication symbols (I, want, need, etc.)
- **Emotions**: Feelings and emotional expressions
- **Actions**: Common verbs and activities
- **Custom**: User-created symbols with personalized content

### Adding Custom Symbols
1. **Via Interface**: Use the "Add Symbol" button (➕) in the side controls
   - Enter display text (what appears on the button)
   - Enter spoken text (what gets added to the message)
   - Optional: Upload custom images for visual symbols
   - Symbols are automatically saved to device storage

2. **Programmatic Addition**: Modify the symbol data structure in `script.js`
   ```javascript
   // Example: Adding new symbols to any category
   const customSymbols = {
       "custom": [
           { text: "Hello", spoken: "Hello there! " },
           { text: "Goodbye", spoken: "See you later! " }
       ]
   };
   ```

3. **Image Support**: 
   - Upload any image format (PNG, JPG, GIF, etc.)
   - Automatic resizing and optimization
   - Images stored locally for offline access

### Symbol Management
- **Persistent Storage**: All custom symbols saved to browser local storage
- **Export/Import**: Easy backup and sharing of symbol sets
- **Category Organization**: Symbols automatically organized by category
- **No Limits**: Add unlimited symbols and categories as needed

## Local Server Setup & Multi-Device Access

### Running on Desktop/Laptop Server

1. **Simple HTTP Server** (Recommended):
   ```bash
   # Using Python (built into most systems)
   python -m http.server 8080
   
   # Or using Python 3
   python3 -m http.server 8080
   
   # Or using Node.js (if installed)
   npx serve . -p 8080
   ```

2. **Find Your Local IP Address**:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   # Look for your local IP (usually 192.168.x.x or 10.x.x.x)
   ```

3. **Access from Server Computer**: 
   Open `http://localhost:8080` in your browser

### Accessing from Tablet/Mobile Devices

1. **Ensure Same Network**: Connect tablet/mobile to the same WiFi network as your server computer

2. **Access via Local IP**: On your tablet/mobile browser, navigate to:
   ```
   http://[YOUR-LOCAL-IP]:8080
   ```
   Example: `http://192.168.1.100:8080`

3. **Test Connection**: The EchoBoard interface should load normally with full functionality

### PWA Installation for Offline Use

#### Installing on Mobile Devices (iOS/Android)

1. **Open in Browser**: Navigate to the local server URL on your mobile device
2. **Add to Home Screen**:
   - **iOS Safari**: Tap Share button → "Add to Home Screen"
   - **Android Chrome**: Tap menu (⋮) → "Add to Home screen" or "Install app"
3. **Choose App Name**: Customize the name that appears on your homescreen
4. **Install**: Tap "Add" or "Install"

#### After Installation
- **Homescreen Icon**: EchoBoard appears as a native app icon
- **Offline Functionality**: App works completely offline once installed
- **No Server Required**: Device can be disconnected from the local server
- **Native Experience**: Runs full-screen without browser interface
- **Background Storage**: All symbols and settings saved locally

#### Updating the App
- Reconnect to local server when updates are available
- Refresh the installed PWA to get latest changes
- Re-install if major updates are made

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Development Mode
```bash
npm run dev
```
This will start a local development server on `http://localhost:3000`

#### Production Build
```bash
npm run build
```
This creates a `dist` folder with production-ready files.

### Mobile Development (Optional)

If you want to build native mobile apps:

#### Initialize Capacitor
```bash
npm run cap:init
```

#### Add platforms
```bash
npm run cap:add:ios     # For iOS
npm run cap:add:android # For Android
```

#### Sync and open
```bash
npm run cap:sync
npm run cap:open:ios     # Opens in Xcode
npm run cap:open:android # Opens in Android Studio
```

## Why This Approach?

### Ultra-Lightweight Architecture
- **Total Size**: Only 319 KB for the entire application
- **No Framework Bloat**: Pure HTML, CSS, and JavaScript
- **Fast Loading**: Instant startup times, even on slower devices
- **Minimal Storage**: Perfect for devices with limited space
- **Quick Deployment**: Easy to host anywhere or distribute

### AAC-Specific Benefits
- **Immediate Loading**: Critical for users who need to communicate urgently
- **Reliable Offline**: Communication apps must work without internet
- **Battery Efficiency**: Less framework overhead = longer battery life
- **Accessibility Standards**: Web accessibility standards are more mature than mobile-specific ones
- **Cross-Platform**: 95%+ code reuse across web, iOS, and Android

## Project Structure

- `index.html` - Main application HTML
- `script.js` - Application JavaScript logic
- `style.css` - Application styles
- `manifest.json` - PWA manifest file
- `sw.js` - Service worker for offline functionality
- `icons/` - App icons for different sizes
- `capacitor.config.ts` - Capacitor configuration for mobile builds

## Usage

1. **Text Input**: Use the text area or on-screen keyboard to type messages
2. **Symbol Selection**: Choose from categorized symbols to build messages
3. **Custom Symbols**: Add your own symbols using the ➕ button in the side controls
4. **Speech**: Click "Speak" to have your message read aloud
5. **Controls**: Access speech settings (voice, rate, pitch) and display options
6. **Quick Phrases**: Access commonly used phrases for faster communication
7. **PWA Installation**: Install to device homescreen for offline native app experience

## Browser Support

- Modern browsers that support Web Speech API
- Progressive Web App features work best in Chrome, Safari, and Edge
- Offline functionality available through service worker

## License

© 2025 Federico Chialvo and Dean Sitton. All rights reserved.

This is a proof of concept project exploring better UX for AAC communication apps.

## About

This project was created as a collaborative exploration between Federico Chialvo and Dean Sitton to investigate how to build more effective and accessible talker app user experiences. 