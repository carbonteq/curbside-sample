# Curbside Sample

A React + TypeScript component showcase built with Material UI (MUI), demonstrating the Curbside Health design system — including theming, palette, custom components, and multi-page navigation.

## Tech Stack

- **React** 19 + **TypeScript** 5.7
- **Material UI (MUI)** v6 with Emotion
- **Vite** 6 (dev server + bundler)
- **MUI X Date Pickers** v7
- **Lucide React** icons

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

## Setup

```bash
# Clone the repository
git clone https://github.com/carbonteq/curbside-sample.git
cd curbside-sample

# Install dependencies
npm install
```

## Running the App

```bash
# Start the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
├── app/                  # Root app wrapper
├── components/           # Reusable UI components
├── pages/
│   ├── AccountSettings/  # Account settings page
│   ├── AnalyticsPage/    # Analytics dashboard
│   ├── ComponentShowcase/# UI component showcase
│   ├── LibraryPage/      # Component library
│   └── UsersPage/        # User management
├── theme/
│   ├── components/       # MUI component overrides
│   ├── palette.ts        # Color palette
│   ├── custom-variables.ts
│   └── recipes.ts        # Reusable style recipes
├── App.tsx               # Main app with tab navigation
└── main.tsx              # Entry point
```

## Theme

The app supports **light**, **dark**, and **system** themes, toggled from the top navigation bar. The design system is defined in `src/theme/` and follows Curbside Health's design tokens and MUI customizations.
