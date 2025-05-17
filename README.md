# Frontend Essentials

A repository that collects experiments and solutions for various edge cases and challenges encountered in frontend development.

## URL

https://almond-bongbong.github.io/frontend-essentials/

## Solved Challenges

### 1. iOS Mobile Keyboard & Bottom Fixed CTA

**Problem**: On iOS Safari/Chrome, when the virtual keyboard appears, `position: fixed` elements break their positioning, causing bottom-aligned CTAs to disappear under the keyboard.

**Solution**:

- Uses `visualViewport` API to track keyboard height in real-time
- Implements smooth animation using `transform: translateY()`
- Handles various edge cases:
  - Safari URL-bar collapse
  - Pre-existing page scroll
  - Touch gestures during typing
  - Keyboard animation timing

**Location**: `/essentials/bottom-fixed-area`

### 2. [Next Challenge]

**Problem**: [Description of the problem]

**Solution**:

- [Key solution points]
- [Edge cases handled]

**Location**: `/essentials/[folder-name]`

## Tech Stack

### Core Technologies

- React 19
- TypeScript
- TanStack Router

### Development Tools

- Vite (Build Tool)
- ESLint (Code Quality)
- Prettier (Code Formatting)
- SASS (Styling)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation and Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
```

## License

MIT
