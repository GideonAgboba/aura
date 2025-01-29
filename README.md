# Aura - Emotion Tracking & Wellness Web App

## Overview

Aura is a simple React emotion tracking example webapp designed to help users track, monitor, and understand their emotional well-being. The app provides intuitive mood logging capabilities along with insightful analytics to help users identify patterns in their emotional health. You can locate the mobile version on the [main branch](https://github.com/GideonAgboba/aura/tree/main).

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

### Installation

1. Clone the repository

```bash



git clone --branch web https://github.com/GideonAgboba/aura.git



cd  aura



```

2. Install dependencies

```bash



yarn  install



# or



npm  install



```

### Running the App

Runs the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\

You will also see any lint errors in the console.

## Project Structure

```



src/



├── navigation/ # Navigation configuration



├── pages/ # page components



├── tests/ # test configs



├── shared/ # Shared utilities and components



│ ├── assets/ # Images, fonts, etc.



│ ├── components/ # Reusable UI components



│ ├── constants/ # App constants



│ ├── context/ # React Context definitions



│ ├── helpers/ # Helper utilities



│ ├── hooks/ # Custom hooks



│ ├── store/ # Zustand store



│ └── types/ # Shared TypeScript types



└── types/ # Root level TypeScript types



```

## Technical Decisions & Assumptions

### 1. State Management

- \***\*Zustand with Persistence\*\***: Implemented persistent mood data storage using Zustand with AsyncStorage, chosen for its simplicity and built-in persistence capabilities over more complex solutions like Redux.

- \***\*Context API for Theming\*\***: Used React Context specifically for theme management to maintain separation of concerns.

### 2. Animation Implementation

Used framer-motion library and css animation. This decision was made to:

- Provide smooth transitions now

### 3. Event-Driven Architecture

Implemented an event-driven approach using eventemitter3 instead of Higher-Order Components (HOC) for cross-component communication. This decision was made to:

- Reduce component coupling

- Avoid sharing unrelated data between components

- Enable more granular control over component updates

- Improve testing capabilities

## Testing

Run the test suite:

```bash



yarn  test



# or



npm  test



```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
