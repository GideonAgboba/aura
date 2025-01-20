# Aura - Emotion Tracking & Wellness App

## Overview

Aura is a simple React Native emotion tracking example application designed to help users track, monitor, and understand their emotional well-being. The app provides intuitive mood logging capabilities along with insightful analytics to help users identify patterns in their emotional health.

### Key Features

- Daily mood tracking and logging

- Mood trend visualization and analytics

- Mood score calculations

- Mood insights dashboard

- Theme customization support

- Persistent data storage

## Getting Started

### Prerequisites

- Node.js (v18 or later)

- npm or yarn

- iOS/Android development environment setup

- React Native CLI

### Installation

1. Clone the repository

```bash

git clone https://github.com/GideonAgboba/aura.git

cd aura

```

2. Install dependencies

```bash

yarn install

# or

npm install

```

3. Install iOS dependencies (iOS only)

```bash

cd ios

pod install

cd ..

```

### Running the App

- For iOS:

```bash

yarn ios

# or

npm run ios

```

- For Android:

```bash

yarn android

# or

npm run android

```

## Project Structure

```

src/

├── navigation/  # Navigation configuration

├── screens/  # Screen components

├── shared/ # Shared utilities and components

│ ├── assets/  # Images, fonts, etc.

│ ├── components/  # Reusable UI components

│ ├── constants/ # App constants

│ ├── context/ # React Context definitions

│ ├── helpers/ # Helper utilities

│ ├── hooks/ # Custom hooks

│ ├── libs/  # Third-party library configurations

│ ├── store/ # Zustand store

│ └── types/ # Shared TypeScript types

└── types/ # Root level TypeScript types

```

## Technical Decisions & Assumptions

### 1. State Management

- \***\*Zustand with Persistence\*\***: Implemented persistent mood data storage using Zustand with AsyncStorage, chosen for its simplicity and built-in persistence capabilities over more complex solutions like Redux.

- \***\*Context API for Theming\*\***: Used React Context specifically for theme management to maintain separation of concerns.

### 2. Animation Implementation

Used react-native-reanimated "legacy" shared transitions, acknowledging that Shared Elements Transitions are not yet implemented in React Native's New Architecture. This decision was made to:

- Provide smooth transitions now

- Maintain compatibility with current architecture

- Enable future migration when New Architecture support is available

### 3. Event-Driven Architecture

Implemented an event-driven approach using eventemitter3 instead of Higher-Order Components (HOC) for cross-component communication. This decision was made to:

- Reduce component coupling

- Avoid sharing unrelated data between components

- Enable more granular control over component updates

- Improve testing capabilities

## Testing

Run the test suite:

```bash

yarn test

# or

npm test

```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
